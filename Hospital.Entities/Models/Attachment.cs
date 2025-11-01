using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Models
{
    public class Attachment
    {
        [Key]
        public int AttachmentId { get; set; }
        public int ActionId { get; set; } // Patient = 1, Admission = 2, SurgicalIntervention = 3, FollowUp = 4
        public int ActionTypeId { get; set; }
        public string FileName { get; set; }
        public string ExistFileName { get; set; }
        public string FileSize { get; set; }
        public string InsertUser { get; set; }
        public DateTime InsertDate { get; set; }
    }
}
