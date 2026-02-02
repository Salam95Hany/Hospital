using Hospital.Entities.Reports;
using Hospital.Interfaces.IPatients;
using Hospital.Reports.Interface;
using Hospital.Reports.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Reports.ExcelTemplate
{
    public class PatientSearchExcelTempGenerator : IReportGenerator
    {
        private readonly IExportManagerService _exportManagerService;
        private readonly IPatientSearchService _patientSearchService;
        public PatientSearchExcelTempGenerator(IExportManagerService exportManagerService, IPatientSearchService patientSearchService)
        {
            _exportManagerService = exportManagerService;
            _patientSearchService = patientSearchService;
        }

        public ReportType ReportType => ReportType.PatientSearchExcel;

        public async Task<string> Generate(SearchReportModel Model)
        {
            var Data = await _patientSearchService.GetExportPatientSearchData(Model.FilterList);
            var ExportTemplate = new ExportTemplateBase { Name = "Patient Search", SheetName = "Patient Search", TemplateName = "Patient Search", UserName = Model.UserName };
            var File = _exportManagerService.Export(ExportTemplate, Data.Results);
            return File;
        }
    }
}
