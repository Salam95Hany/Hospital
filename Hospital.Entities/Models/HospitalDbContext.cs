using Hospital.Entities.Auth;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Models
{
    public partial class HospitalDbContext : IdentityDbContext<AdminUser>
    {
        public HospitalDbContext(DbContextOptions<HospitalDbContext> options)
        : base(options)
        {
        }
    }
}
