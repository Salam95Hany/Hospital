using Hospital.Entities.Common;
using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Specifications.Doctors
{
    public class DoctorDataSpecification : BaseSpecification<Doctor>
    {
        public DoctorDataSpecification(PagingFilterModel PagingFilter, bool applyPaging = true) : base(i => i.IsDeleted == false)
        {
            var searchText = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "SearchText")?.ItemId;

            if (searchText != null)
            {
                AddCriteria(fc => fc.DoctorName.Contains(searchText));
            }


            ApplyOrderBy(fc => fc.InsertDate);
            if (applyPaging)
                ApplyPaging((PagingFilter.Currentpage - 1) * PagingFilter.Pagesize, PagingFilter.Pagesize);
        }
    }
}
