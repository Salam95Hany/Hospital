using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Specifications.FollowUps
{
    public class FollowupBySurgicalInterventionIdSpecification : BaseSpecification<FollowUp>
    {
        public FollowupBySurgicalInterventionIdSpecification(List<int> Ids) : base(i => Ids.Contains((int)i.SurgicalInterventionId))
        {

        }
    }
}
