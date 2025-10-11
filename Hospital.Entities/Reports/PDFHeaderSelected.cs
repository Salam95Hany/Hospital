using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Reports
{
    public class PDFHeaderSelected
    {
        public string NameEn { get; set; }
        public string NameAr { get; set; }
        public bool IsAllowSummation { get; set; }
        public string ValueType { get; set; }
        public int DisplayOrder { get; set; }
    }
}
