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
        public string? HospitalFileNumber { get; set; }
        public string? HospitalBranch { get; set; }
        public DateTime? AdmissionDate { get; set; }
        public DateTime? DischargeDate { get; set; }

        // Medical History
        public string? ChiefComplaint { get; set; }
        public string? Duration { get; set; }

        // NEW: Course as enum or string for checkboxes
        public string? Course { get; set; }

        public string? HPI { get; set; }

        // NEW: Comorbidities as JSON string or separate table
        public string? Comorbidities { get; set; }

        public string? CurrentMedications { get; set; }
        public string? PastHistory { get; set; }
        public string? FamilyHistory { get; set; }

        // Examination - NEW PROPERTIES
        public string?   BMI { get; set; }
        public decimal? Temperature { get; set; }
        public int? Pulse { get; set; }
        public string? BloodPressure { get; set; }
        public string? GeneralExamination { get; set; }
        public string? AbdominalExamination { get; set; }
        public string? GenitalExamination { get; set; }
        public string? DREVaginalExamination { get; set; }

        // Lab Investigations - NEW PROPERTIES
        public string? UrineAnalysis { get; set; }
        public string? UrinePusCells { get; set; }
        public string? UrineRBCs { get; set; }
        public string? UrineCrystals { get; set; }
        public string? UrineAlbumin { get; set; }
        public string? UrineSugar { get; set; }
        public string? UrineOthers { get; set; }
        public string? CultureAndSensitivity { get; set; }
        public decimal? SerumCreatinine { get; set; }
        public decimal? Hemoglobin { get; set; }
        public decimal? TotalLeukocyteCount { get; set; }
        public decimal? Platelets { get; set; }
        public string? PT_PTT_INR { get; set; }
        public string? LiverEnzymes { get; set; }

        // NEW: Blood Sugar sub-values
        public decimal? FastingBloodSugar { get; set; }
        public decimal? PostPrandialBloodSugar { get; set; }
        public decimal? HbA1c { get; set; }

        // NEW: PSA sub-values
        public decimal? PSATotal { get; set; }
        public decimal? PSAFree { get; set; }
        public decimal? PSARatio { get; set; }

        public string? OtherLabResults { get; set; }

        // Imaging Investigations - NEW PROPERTIES
        public string? PUT { get; set; }
        public string?    Ultrasound { get; set; }
        public string? TRUS { get; set; }
        public string? CT { get; set; }
        public string? MRI { get; set; }
        public string? IsotopeStudies { get; set; }
        public string? OtherImaging { get; set; }

        // Diagnosis and Planning
        public string? ProvisionalDiagnosis { get; set; }
        public string? MedicalDecision { get; set; }
        public string? ImagingResult { get; set; }
        public DateTime? ScheduledDate { get; set; }

        [NotMapped]
        public UploadFileModel? FileModel { get; set; }


        // Navigation properties
        [ForeignKey("PatientId")]
        public virtual Patient? Patient { get; set; }

        public ICollection<SurgicalIntervention> SurgicalInterventions { get; set; } = new List<SurgicalIntervention>();
        public ICollection<FollowUp> FollowUps { get; set; } = new List<FollowUp>();
    }
}
