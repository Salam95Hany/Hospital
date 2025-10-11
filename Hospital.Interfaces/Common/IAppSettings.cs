using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Interfaces.Common
{
    public interface IAppSettings
    {
        string ApiUrlLocal { get; set; }
        string ApiUrlProd { get; set; }
        string UiHost { get; set; }
        string BackupFilePath { get; set; }
        string ImageFilePath { get; set; }
        string[] URLList { get; set; }
        ConnectionStrings ConnectionStrings { get; set; }
        JWT Jwt { get; set; }
    }

    public class ConnectionStrings
    {
        public string DBConnection { get; set; }
    }

    public class JWT
    {
        public string Key { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int ExpiryMinutes { get; set; }
    }
}
