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


        public DateTime? InterventionDate { get; set; } 

        public string Theater { get; set; }

 
        public string MainSurgeon { get; set; } 

  
        public string Assistants { get; set; } 


        public string Resident { get; set; } 


        public string Anesthesia { get; set; } 

        // Intervention Details
        public string Intervention { get; set; } 

        public string InterventionDetails { get; set; }


        public string TubesFixed { get; set; } 


        public string Category { get; set; } 


        public string Approach { get; set; }


        public string Organ { get; set; } 

        
        public string IntraOperativeCourse { get; set; }
        public string IntraOpAdverseEvents { get; set; } 

        public int? BloodTransfusionUnits { get; set; } 

        public string PostOpRecommendations { get; set; } 

        public string PostOpDay0_1 { get; set; }

        public string PostOpDay2_5 { get; set; }

        public string PostOpDayOver5 { get; set; }

        public string PostOpAdverseEvents { get; set; } 

        // Discharge
        public DateTime? DischargeDate { get; set; } 

        public string FinalDiagnosis { get; set; } 

        public string DischargeInstructions { get; set; } 

        public string FollowUpDoctor { get; set; } 

        public string FollowUpDoctorPhone { get; set; } 

        public DateTime? FollowUpAppointment { get; set; } 

        [ForeignKey("AdmissionId")]
        public virtual Admission Admission { get; set; }

        public ICollection<FollowUp> FollowUps { get; set; } = new List<FollowUp>();

    }
}
