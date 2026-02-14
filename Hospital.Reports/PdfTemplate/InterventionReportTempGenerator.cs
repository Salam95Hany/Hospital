using Hospital.Entities.Reports;
using Hospital.Reports.Interface;
using Hospital.Reports.Model;
using Microsoft.AspNetCore.Hosting;
using QuestPDF.Infrastructure;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hospital.Reports.Service;
using Hospital.Interfaces.Reports;
using RazorLight;

namespace Hospital.Reports.PdfTemplate
{
    public class InterventionReportTempGenerator : ReportGenerator, IReportGenerator
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IReportsDataService _reportsDataService;
        public override ReportType ReportType => ReportType.InterventionReport;

        public InterventionReportTempGenerator(IWebHostEnvironment environment, IReportsDataService reportsDataService, IRazorLightEngine razorEngine, IPDFHelper pDFHelper) : base(razorEngine, pDFHelper)
        {
            _environment = environment;
            _reportsDataService = reportsDataService;
        }


        public async Task<string> Generate(SearchReportModel Model)
        {
            var PatientId = Model.QueryString.FirstOrDefault(i => i.Key == "PatientId")?.Value;
            var AdmissionId = Model.QueryString.FirstOrDefault(i => i.Key == "AdmissionId")?.Value;
            var SurgicalId = Model.QueryString.FirstOrDefault(i => i.Key == "SurgicalId")?.Value;
            if (!string.IsNullOrEmpty(PatientId) && !string.IsNullOrEmpty(AdmissionId) && !string.IsNullOrEmpty(SurgicalId))
            {
                var Results = await _reportsDataService.GetAdmissionTempData(int.Parse(PatientId), int.Parse(AdmissionId), int.Parse(SurgicalId));
                var Data = new PdfDataReports
                {
                    Data = Results,
                    ImageSrc = Path.Combine(_environment.WebRootPath, "Template", "Logo.png")
                };

                var FullPath = await this.Build(Data);
                return FullPath;
            }
            else
                return string.Empty;

        }
    }
}
