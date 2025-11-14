using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Common
{
    public class AddPatientFullModel
    {
        public Patient Patient { get; set; }
        public Admission Admission { get; set; }
        public SurgicalIntervention? SurgicalIntervention { get; set; }
        public FollowUp? FollowUp { get; set; }
    }
}
