using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Auth
{
    public class AdminUser: IdentityUser
    {
        public string Address { get; set; }
        public bool IsActive { get; set; }
        public DateTime? LoginDate { get; set; }
    }
}
