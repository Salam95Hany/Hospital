using Hospital.Entities.Common;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Reports
{
    public class SearchReportModel
    {
        public string ReportType { get; set; }
        public bool IsLandScape { get; set; }
        public int RowCount { get; set; }
        public string? UserName { get; set; }
        public List<QueryString> QueryString { get; set; } = new();
        public List<FilterModel> FilterItems { get; set; } = new();
        public List<PDFHeaderSelected> Headers { get; set; } = new();
    }

    public class QueryString
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}
