using Hospital.Entities.Common;
using Hospital.Entities.Models;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Specifications.Patients
{
    public class PatientDataSpecification:BaseSpecification<Patient>
    {
        public PatientDataSpecification(PagingFilterModel PagingFilter, bool applyPaging = true) :base(i => i.IsDeleted == false)
        {

            var searchText = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "SearchText")?.ItemId;
            var addressText = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Address Text")?.ItemId;

            if (!string.IsNullOrEmpty(searchText))
                AddCriteria(fc => fc.InternalNumber.Contains(searchText));
            if (!string.IsNullOrEmpty(addressText))
                AddCriteria(fc => fc.Governorate.Contains(addressText));

            AddInclude(fc => fc.CreatedBy);

            ApplyOrderBy(fc => fc.InsertDate);
            if (applyPaging)
                ApplyPaging((PagingFilter.Currentpage - 1) * PagingFilter.Pagesize, PagingFilter.Pagesize);
        }
    }
}
