using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Contracts.DTOs
{
    public class FollowUpDto
    {
        public int FollowUpId { get; set; }
        public int SurgicalInterventionId { get; set; }
        public int AdmissionId { get; set; }
        public int PatientId { get; set; }
        public DateTime? FollowUpDate { get; set; }
        public string? PatientRemarksStatus { get; set; }
        public string? PatientName { get; set; }
        public string? CreatedBy { get; set; }
    }
}
