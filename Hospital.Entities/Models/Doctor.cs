using Hospital.Entities.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Models
{
    public class Doctor : AuditableEntity
    {
        [Key]
        public int DoctorId { get; set; }
        public string DoctorName { get; set; }
        public string? AcademicDegree { get; set; }
        public bool IsDeleted { get; set; }
    }
}
