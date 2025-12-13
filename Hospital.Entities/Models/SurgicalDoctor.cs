using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Models
{
    public class SurgicalDoctor
    {
        [Key]
        public int SurgicalDoctorId { get; set; }
        public int SurgicalInterventionId { get; set; }
        public int DoctorId { get; set; }
    }
}
