using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Specifications.FollowUps
{
    public class FollowUpDataSpecification : BaseSpecification<FollowUp>
    {
        public FollowUpDataSpecification(int SurgicalInterventionId) : base(i => i.SurgicalInterventionId == SurgicalInterventionId)
        {
            AddCriteria(i => i.IsDeleted == false);
            AddInclude("SurgicalInterventions.Admission.Patient");
            AddInclude(i => i.CreatedBy);
        }
    }
}
