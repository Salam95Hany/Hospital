using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Specifications.Admissions
{
    public class AdmissionDataSpecification:BaseSpecification<Admission>
    {
        public AdmissionDataSpecification(int PatientId) :base(i => i.PatientId == PatientId)
        {
            AddCriteria(i => i.IsDeleted.Value == false);
            AddInclude(i => i.CreatedBy);
            AddInclude(i => i.Patient);
        }
    }
}
