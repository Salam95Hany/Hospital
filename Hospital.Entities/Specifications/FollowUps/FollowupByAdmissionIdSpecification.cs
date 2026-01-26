using Hospital.Entities.Common;
using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Specifications.FollowUps
{
    public class FollowupByAdmissionIdSpecification:BaseSpecification<FollowUp>
    {
        public FollowupByAdmissionIdSpecification(int AdmissionId):base(x => x.AdmissionId == AdmissionId && x.IsDeleted == false)
        {
          
        }
    }
}
