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
        public string HospitalFileNumber { get; set; } // رقم ملف المستشفى

        public DateTime? AdmissionDate { get; set; } // تاريخ الدخول
        public DateTime? DischargeDate { get; set; } // تاريخ الخروج

        // Medical History
        public string ChiefComplaint { get; set; } // C/O


        public string Duration { get; set; } // Duration

        public string Course { get; set; } // Course


        public string HPI { get; set; } // HPI


        public string CurrentMedications { get; set; } // Current medications


        public string PastHistory { get; set; } // Past history


        public string FamilyHistory { get; set; } // Family history

        public string Comorbidities { get; set; } // Current comorbidities

        // Examination
        public string BMI { get; set; } // BMI

        public decimal? Temperature { get; set; } // Temp
        public int? Pulse { get; set; } // Pulse

        public string BloodPressure { get; set; } // BP

        public string GeneralExamination { get; set; } // General Examination


        public string AbdominalExamination { get; set; } // Abdominal Examination


        public string GenitalExamination { get; set; } // Genital Examination

        public string DREVaginalExamination { get; set; } // DRE/Vaginal Examination

        public string LabResults { get; set; } // Combined lab results

        public string ImagingResults { get; set; } // Combined imaging results


        public string ProvisionalDiagnosis { get; set; } // Provisional Diagnosis

        public string MedicalDecision { get; set; } // Medical Decision

        public DateTime? ScheduledDate { get; set; } // Scheduled date

        // Navigation properties
        [ForeignKey("PatientId")]
        public virtual Patient Patient { get; set; }

        public ICollection<SurgicalIntervention> SurgicalInterventions { get; set; } = new List<SurgicalIntervention>();
    }
}
