using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Reports.Model
{
    public class PdfDataReports
    {
        public Dictionary<string, string> Data { get; set; }
        public string ImageSrc { get; set; }

        public string GetDataFieldValue(string key)
        {
            if (!Data.ContainsKey(key) || string.IsNullOrWhiteSpace(Data[key]))
                return string.Empty;

            var value = Data[key];

            if (DateTime.TryParse(value, out DateTime date))
                return date.ToString("yyyy-MM-dd");

            return value;
        }

        public string GetTdDirectionStyle(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return "dir='ltr' style='padding-left:5px;'";

            bool hasArabic = text.Any(c => c >= 0x0600 && c <= 0x06FF);

            if (hasArabic)
                return "dir='rtl' style='padding-right:5px;'";
            else
                return "dir='ltr' style='padding-left:5px;'";
        }
    }
}
