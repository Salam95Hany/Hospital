using Hospital.Entities.Common;
using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Specifications.Admissions
{
    public class AdmissionDataSpecification : BaseSpecification<Admission>
    {
        public AdmissionDataSpecification(PagingFilterModel PagingFilter, int PatientId, bool applyPaging = true) : base(i => i.PatientId == PatientId && i.IsDeleted.Value == false)
        {
            var searchText = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "SearchText")?.ItemId;

            var AdmissionDateFrom = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Admission Date")?.From;
            var AdmissionDateTo = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Admission Date")?.To;

            var DischargeDateFrom = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Discharge Date")?.From;
            var DischargeDateTo = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Discharge Date")?.To;

            if (!string.IsNullOrEmpty(searchText))
                AddCriteria(fc => fc.HospitalFileNumber.Contains(searchText));

            if (AdmissionDateFrom != null && AdmissionDateTo != null)
            {
                AddCriteria(fc => fc.AdmissionDate >= DateTime.Parse(AdmissionDateFrom) && fc.AdmissionDate <= DateTime.Parse(AdmissionDateTo));
            }

            if (DischargeDateFrom != null && DischargeDateTo != null)
            {
                AddCriteria(fc => fc.DischargeDate >= DateTime.Parse(DischargeDateFrom) && fc.DischargeDate <= DateTime.Parse(DischargeDateTo));
            }

            AddInclude(i => i.CreatedBy);
            AddInclude(i => i.Patient);

            ApplyOrderBy(fc => fc.InsertDate);
            if (applyPaging)
                ApplyPaging((PagingFilter.Currentpage - 1) * PagingFilter.Pagesize, PagingFilter.Pagesize);
        }
    }
}
