using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Contracts.DTOs
{
    public class SurgicalInterventionDto
    {
        public int SurgicalInterventionId { get; set; }
        public int AdmissionId { get; set; }
        public int PatientId { get; set; }
        public string? PatientName { get; set; }
        public string? InternalNumber { get; set; }
        public DateTime? InterventionDate { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? Theater { get; set; }
        public string? CreatedBy { get; set; }
        public string? DoctorName { get; set; }
    }
}
