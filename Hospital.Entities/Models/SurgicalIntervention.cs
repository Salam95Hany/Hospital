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
    public class SurgicalIntervention : AuditableEntity
    {
        [Key]
        public int SurgicalInterventionId { get; set; }

   
        public int AdmissionId { get; set; }


        public DateTime? InterventionDate { get; set; } // Date of intervention

        public string Theater { get; set; } // Theatre

 
        public string MainSurgeon { get; set; } // Main Surgeon

  
        public string Assistants { get; set; } // Assistants


        public string Resident { get; set; } // Resident


        public string Anesthesia { get; set; } // Anaesthesia

        // Intervention Details
        public string Intervention { get; set; } // Intervention

        public string InterventionDetails { get; set; } // Intervention Details


        public string TubesFixed { get; set; } // Tubes fixed


        public string Category { get; set; } // Category


        public string Approach { get; set; } // Approach


        public string Organ { get; set; } // Organ

        // Intra-operative
        public string IntraOperativeCourse { get; set; } // Intra-operative Course
        public string IntraOpAdverseEvents { get; set; } // Intra-op adverse events

        public int? BloodTransfusionUnits { get; set; } // Blood transfusion

        public string PostOpRecommendations { get; set; } // Post-op Recommendations

        public string PostOpDay0_1 { get; set; }

        public string PostOpDay2_5 { get; set; }

        public string PostOpDayOver5 { get; set; }

        public string PostOpAdverseEvents { get; set; } // Post-op adverse events

        // Discharge
        public DateTime? DischargeDate { get; set; } // Date of discharge

        public string FinalDiagnosis { get; set; } // Final diagnosis

        public string DischargeInstructions { get; set; } // نصائح مابعد الخروج

        public string FollowUpDoctor { get; set; } // اسم الطبيب المختص بالمتابعة

        public string FollowUpDoctorPhone { get; set; } // تليفون الطبيب المختص بالمتابعة

        public DateTime? FollowUpAppointment { get; set; } // الموعد المقرر للمتابعة

        [ForeignKey("AdmissionId")]
        public virtual Admission Admission { get; set; }

        public ICollection<FollowUp> FollowUps { get; set; } = new List<FollowUp>();

    }
}
