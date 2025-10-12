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

        public int SurgicalInterventionId { get; set; }

        public DateTime FollowUpDate { get; set; }


        public string PatientRemarks { get; set; } // Better, Worse, The same

        public string PatientRemarksDetails { get; set; } // Details


        public string ExaminationFindings { get; set; } // Examination findings

        public string WoundStatus { get; set; } // Wound

        public string Catheters { get; set; } // Catheters

        // Investigations
        public string LabResults { get; set; } // Lab

        public string ImagingResults { get; set; } // Imaging

        public string ImagePath { get; set; } // Path to scanned images

        // Medical Decisions
        public string Advice { get; set; } // Advice

        public string NewDecision { get; set; } // New decision

        public DateTime? NextFollowUpDate { get; set; } // الموعد المقرر للمتابعة

        [ForeignKey("SurgicalInterventionId")]
        public SurgicalIntervention SurgicalInterventions { get; set; }
    }
}
