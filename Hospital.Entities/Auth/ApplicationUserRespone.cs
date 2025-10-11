using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Auth
{
    public class ApplicationUserRespone
    {
        public string UserId { get; set; }
        public string Token { get; set; }
        public string UserName { get; set; }
        public DateTime LoginDate { get; set; }
        public string LoginDateAr { get; set; }
        public string LoginTimeAr { get; set; }
        public string Role { get; set; }
        public string RoleId { get; set; }
        public int ExpiresIn { get; set; }
    }

    public class LoginModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
