using Hospital.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Services.Common
{
    public class AppSettings: IAppSettings
    {
        public string ApiUrlLocal { get; set; }
        public string ApiUrlProd { get; set; }
        public string UiHost { get; set; }
        public string BackupFilePath { get; set; }
        public string ImageFilePath { get; set; }
        public string[] URLList { get; set; }
        public ConnectionStrings ConnectionStrings { get; set; }
        public JWT Jwt { get; set; }
    }
}
