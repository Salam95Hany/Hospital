using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Specifications.FollowUps
{
    public class FollowUpDataSpecification:BaseSpecification<FollowUp>
    {
        public FollowUpDataSpecification():base()
        {
            AddInclude(i => i.SurgicalInterventions);
            AddInclude(i => i.CreatedBy);
        }
    }
}
