using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Contracts.DTOs
{
    public class AdmissionDto
    {
        public int AdmissionId { get; set; }
        public int PatientId { get; set; }
        public string? HospitalFileNumber { get; set; }
        public DateTime? AdmissionDate { get; set; }
        public DateTime? DischargeDate { get; set; }
        public string? PatientName { get; set; }
        public string? CreatedBy { get; set; }
    }
}
