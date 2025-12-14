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

namespace Hospital.Reports.PdfTemplate
{
    public class TestPdfTempGenerator : ReportGenerator, IReportGenerator
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IReportsDataService _reportsDataService;
        public ReportType ReportType => ReportType.TestReportPdf;

        public TestPdfTempGenerator(IWebHostEnvironment environment, IReportsDataService reportsDataService)
        {
            _environment = environment;
            _reportsDataService = reportsDataService;
        }


        public async Task<string> Generate(SearchReportModel Model)
        {
            var PatientId = Model.QueryString.FirstOrDefault(i => i.Key == "PatientId")?.Value;
            var AdmissionId = Model.QueryString.FirstOrDefault(i => i.Key == "AdmissionId")?.Value;
            var SurgicalId = Model.QueryString.FirstOrDefault(i => i.Key == "SurgicalId")?.Value;
            var FollowUpId = Model.QueryString.FirstOrDefault(i => i.Key == "FollowUpId")?.Value;
            if (!string.IsNullOrEmpty(PatientId) && !string.IsNullOrEmpty(AdmissionId) && !string.IsNullOrEmpty(SurgicalId) && !string.IsNullOrEmpty(FollowUpId))
            {
                var Data = await _reportsDataService.GetAdmissionTempData(int.Parse(PatientId), int.Parse(AdmissionId), int.Parse(SurgicalId), int.Parse(FollowUpId));

                var FullPath = this.Build(_environment.WebRootPath, "AdmissionTemp.pdf", Data);
                return FullPath;
            }
            else
                return string.Empty;

        }
    }
}
