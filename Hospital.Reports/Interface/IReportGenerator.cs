using Hospital.Entities.Reports;
using Hospital.Reports.Model;
using OfficeOpenXml.Table.PivotTable;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Reports.Interface
{
    public interface IReportGenerator
    {
        ReportType ReportType { get; }
        Task<string> Generate(SearchReportModel Model);
    }
}
