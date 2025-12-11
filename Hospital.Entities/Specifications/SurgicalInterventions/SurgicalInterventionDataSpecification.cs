using Hospital.Entities.Common;
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
        public SurgicalInterventionDataSpecification(PagingFilterModel PagingFilter,int AdmissionId, bool applyPaging = true) : base(i => i.AdmissionId == AdmissionId && i.IsDeleted == false)
        {
            var InterventionDateFrom = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Intervention Date")?.From;
            var InterventionDateTo = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Intervention Date")?.To;

            if (InterventionDateFrom != null && InterventionDateTo != null)
            {
                AddCriteria(fc => fc.InterventionDate >= DateTime.Parse(InterventionDateFrom) && fc.InterventionDate <= DateTime.Parse(InterventionDateTo));
            }

            AddInclude("Admission.Patient");
            AddInclude(i => i.CreatedBy);
            AddInclude(i => i.Doctor);

            ApplyOrderBy(fc => fc.InsertDate);
            if (applyPaging)
                ApplyPaging((PagingFilter.Currentpage - 1) * PagingFilter.Pagesize, PagingFilter.Pagesize);
        }
    }
}
