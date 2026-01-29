using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Specifications.SurgicalInterventions
{
    public class SurgicalInterventionByAdmissionIdSpecification : BaseSpecification<SurgicalIntervention>
    {
        public SurgicalInterventionByAdmissionIdSpecification(int AdmissionId) : base(x => x.AdmissionId == AdmissionId && x.IsDeleted == false)
        {
        }
    }
}
