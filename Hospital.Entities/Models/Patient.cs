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

        public string Name { get; set; } // الاسم

        public DateTime? BirthDate { get; set; } // تاريخ الميلاد

        public int? Age { get; set; } // السن

        public string Gender { get; set; } // النوع

        public string NationalId { get; set; } // الرقم القومي

        public string Address { get; set; } // محل الإقامة

        public string Governorate { get; set; } // محافظة الإقامة

        public string Occupation { get; set; } // العمل


        public string MaritalStatus { get; set; } // الحالة الاجتماعية

        public string ChildrenCount { get; set; } // عدد الأبناء


        public string InternalNumber { get; set; } // الرقم الداخلي

        // Navigation property
        public  ICollection<Admission> Admissions { get; set; } = new List<Admission>();
    }
}
