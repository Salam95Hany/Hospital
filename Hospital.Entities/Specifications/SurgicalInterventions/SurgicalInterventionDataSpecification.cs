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
        public SurgicalInterventionDataSpecification(int AdmissionId) : base(i => i.AdmissionId == AdmissionId)
        {
            AddCriteria(i => i.IsDeleted == false);
            AddInclude("Admission.Patient");
            AddInclude(i => i.CreatedBy);
        }
    }
}
