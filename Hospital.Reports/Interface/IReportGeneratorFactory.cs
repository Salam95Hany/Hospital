using Hospital.Reports.Model;
using OfficeOpenXml.Table.PivotTable;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Reports.Interface
{
    public interface IReportGeneratorFactory
    {
        IReportGenerator GetGenerator(ReportType type);
    }
}
