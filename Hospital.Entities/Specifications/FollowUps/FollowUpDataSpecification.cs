using Hospital.Entities.Common;
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
        public FollowUpDataSpecification(PagingFilterModel PagingFilter,int SurgicalInterventionId, bool applyPaging = true) : base(i => i.SurgicalInterventionId == SurgicalInterventionId && i.IsDeleted == false)
        {
            var FollowUpDateFrom = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "FollowUp Date")?.From;
            var FollowUpDateTo = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "FollowUp Date")?.To;

            if (FollowUpDateFrom != null && FollowUpDateTo != null)
            {
                AddCriteria(fc => fc.FollowUpDate >= DateTime.Parse(FollowUpDateFrom) && fc.FollowUpDate <= DateTime.Parse(FollowUpDateTo));
            }

            AddInclude("SurgicalInterventions.Admission.Patient");
            AddInclude(i => i.CreatedBy);

            ApplyOrderBy(fc => fc.InsertDate);
            if (applyPaging)
                ApplyPaging((PagingFilter.Currentpage - 1) * PagingFilter.Pagesize, PagingFilter.Pagesize);
        }
    }
}
