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
    public class FollowUp : AuditableEntity
    {
        [Key]
        public int FollowUpId { get; set; }
        public int AdmissionId { get; set; }
        public DateTime? FollowUpDate { get; set; }

        // NEW: Patient remarks as structured data
        public string? PatientRemarksStatus { get; set; } // Better, Worse, The same
        public string? PatientRemarksDetails { get; set; }

        public string? ExaminationFindings { get; set; }
        public string? WoundStatus { get; set; }
        public string? Catheters { get; set; }

        // Investigations
        public string? LabResults { get; set; }
        public string? ImagingResults { get; set; }
        public string? ImagePath { get; set; }

        // Medical Decisions
        public string? Advice { get; set; }
        public string? NewDecision { get; set; }
        public DateTime? NextFollowUpDate { get; set; }

        [NotMapped]
        public UploadFileModel? FileModel { get; set; }

        [ForeignKey("AdmissionId")]
        public virtual Admission? Admission { get; set; }
    }
}
