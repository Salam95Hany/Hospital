using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Specifications.SurgicalInterventions
{
    public class SurgicalInterventionDataSpecification : BaseSpecification<SurgicalIntervention>
    {
        public SurgicalInterventionDataSpecification() : base()
        {
            AddInclude("Admission.Patient");
            AddInclude(i => i.CreatedBy);
        }
    }
}
