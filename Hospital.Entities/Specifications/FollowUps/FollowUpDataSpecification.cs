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
        public FollowUpDataSpecification(PagingFilterModel PagingFilter,int AdmissionId, bool applyPaging = true) : base(i => i.AdmissionId == AdmissionId && i.IsDeleted == false)
        {
            var PatientsRemarks = PagingFilter.FilterList.Where(f => f.CategoryName == "Patient’s remarks").Select(f => f.ItemId).ToList();

            if (PatientsRemarks.Any())
                AddCriteria(fc => PatientsRemarks.Contains(fc.PatientRemarksStatus));

            AddInclude("Admission.Patient");
            AddInclude(i => i.CreatedBy);

            ApplyOrderBy(fc => fc.InsertDate);
            if (applyPaging)
                ApplyPaging((PagingFilter.Currentpage - 1) * PagingFilter.Pagesize, PagingFilter.Pagesize);
        }
    }
}
