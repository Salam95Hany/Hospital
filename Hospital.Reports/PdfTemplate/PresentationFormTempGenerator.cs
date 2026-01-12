using Hospital.Entities.Reports;
using Hospital.Interfaces.Reports;
using Hospital.Reports.Interface;
using Hospital.Reports.Model;
using Hospital.Reports.Service;
using Microsoft.AspNetCore.Hosting;
using RazorLight;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Reports.PdfTemplate
{
    public class PresentationFormTempGenerator : ReportGenerator, IReportGenerator
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IReportsDataService _reportsDataService;
        public override ReportType ReportType => ReportType.PresentationForm;

        public PresentationFormTempGenerator(IWebHostEnvironment environment, IReportsDataService reportsDataService, IRazorLightEngine razorEngine, IPDFHelper pDFHelper) : base(razorEngine, pDFHelper)
        {
            _environment = environment;
            _reportsDataService = reportsDataService;
        }


        public async Task<string> Generate(SearchReportModel Model)
        {
            var PatientId = Model.QueryString.FirstOrDefault(i => i.Key == "PatientId")?.Value;
            var AdmissionId = Model.QueryString.FirstOrDefault(i => i.Key == "AdmissionId")?.Value;
            if (!string.IsNullOrEmpty(PatientId) && !string.IsNullOrEmpty(AdmissionId))
            {
                var Results = await _reportsDataService.GetAdmissionTempData(int.Parse(PatientId), int.Parse(AdmissionId), null);
                var Data = new PdfDataReports
                {
                    Data = Results,
                    ImageSrc = Path.Combine(_environment.WebRootPath, "Template", "Logo.png")
                };

                var FullPath = this.Build(Data);
                return FullPath;
            }
            else
                return string.Empty;

        }
    }
}
