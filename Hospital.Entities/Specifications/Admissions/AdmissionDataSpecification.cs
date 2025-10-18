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
        public AdmissionDataSpecification():base()
        {
            AddInclude(i => i.CreatedBy);
            AddInclude(i => i.Patient);
        }
    }
}
