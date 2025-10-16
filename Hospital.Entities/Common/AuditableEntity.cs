using Hospital.Entities.Auth;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Common
{
    public class AuditableEntity
    {
        public string? InsertUser { get; set; }
        public DateTime? InsertDate { get; set; }
        public string? UpdateUser { get; set; }
        public DateTime? UpdateDate { get; set; }
        [ForeignKey(nameof(InsertUser))]
        public AdminUser? CreatedBy { get; set; } = default!;
        [ForeignKey(nameof(UpdateUser))]
        public AdminUser? UpdatedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
