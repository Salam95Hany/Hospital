using Hospital.Entities.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Models
{
    public class Patient : AuditableEntity
    {
        [Key]
        public int PatientId { get; set; }
        public string Name { get; set; }
        public DateTime? BirthDate { get; set; }
        public int? Age { get; set; }
        public string Gender { get; set; }
        public string NationalId { get; set; }
        public string Address { get; set; }
        public string Governorate { get; set; }
        public string Occupation { get; set; }
        public string MaritalStatus { get; set; }
        public string ChildrenCount { get; set; }
        public string InternalNumber { get; set; }


        // Navigation property
        public  ICollection<Admission> Admissions { get; set; } = new List<Admission>();
    }
}
