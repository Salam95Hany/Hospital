using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hospital.Entities.Common;

namespace Hospital.Entities.Models
{
    public class Admission : AuditableEntity
    {
        [Key]
        public int AdmissionId { get; set; }

        public int PatientId { get; set; }

        // Admission Data
        public string HospitalFileNumber { get; set; } 

        public DateTime? AdmissionDate { get; set; } 
        public DateTime? DischargeDate { get; set; } 

        // Medical History
        public string ChiefComplaint { get; set; } 


        public string Duration { get; set; } 

        public string Course { get; set; } 


        public string HPI { get; set; } 


        public string CurrentMedications { get; set; } 


        public string PastHistory { get; set; } 


        public string FamilyHistory { get; set; } 

        public string Comorbidities { get; set; } 

        // Examination
        public string BMI { get; set; } 

        public decimal? Temperature { get; set; } 
        public int? Pulse { get; set; } 

        public string BloodPressure { get; set; } 

        public string GeneralExamination { get; set; } 


        public string AbdominalExamination { get; set; } 


        public string GenitalExamination { get; set; } 

        public string DREVaginalExamination { get; set; } 

        public string LabResults { get; set; } 

        public string ImagingResults { get; set; } 


        public string ProvisionalDiagnosis { get; set; } 

        public string MedicalDecision { get; set; } 

        public DateTime? ScheduledDate { get; set; } 

        // Navigation properties
        [ForeignKey("PatientId")]
        public virtual Patient Patient { get; set; }

        public ICollection<SurgicalIntervention> SurgicalInterventions { get; set; } = new List<SurgicalIntervention>();
    }
}
