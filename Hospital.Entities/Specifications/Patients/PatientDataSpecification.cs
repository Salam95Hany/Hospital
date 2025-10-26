using Hospital.Entities.Common;
using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Specifications.Patients
{
    public class PatientDataSpecification:BaseSpecification<Patient>
    {
        public PatientDataSpecification(int CurrentPage, bool applyPaging = true) :base(i => i.IsDeleted == false)
        {
            ApplyOrderBy(fc => fc.InsertDate);
            if (applyPaging)
                ApplyPaging((CurrentPage - 1) * 20, 20);
        }
    }
}
