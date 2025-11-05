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
        public PatientDataSpecification(PagingFilterModel PagingFilter, bool applyPaging = true) :base(i => i.IsDeleted == false || i.IsDeleted == null)
        {

            var searchText = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Patient Code")?.ItemId;

            if (!string.IsNullOrEmpty(searchText))
                AddCriteria(fc => fc.InternalNumber.Contains(searchText));

            AddInclude(fc => fc.CreatedBy);

            ApplyOrderBy(fc => fc.InsertDate);
            if (applyPaging)
                ApplyPaging((PagingFilter.Currentpage - 1) * PagingFilter.Pagesize, PagingFilter.Pagesize);
        }
    }
}
