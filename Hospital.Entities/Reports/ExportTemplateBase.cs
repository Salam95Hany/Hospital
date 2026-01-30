using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Reports
{
    public class ExportTemplateBase
    {
        public string Name { get; set; }
        public string UserName { get; set; }
        public string TemplateName { get; set; }
        public string SheetName { get; set; }
        public Dictionary<string, string> SubstitutionDictionary()
        {
            var parameter = new Dictionary<string, string>
            {
                {"TemplateName",TemplateName },
                {"UserName",UserName },
                {"Name",Name },
                {"SheetName",SheetName }
            };
            return parameter;
        }
    }
}
