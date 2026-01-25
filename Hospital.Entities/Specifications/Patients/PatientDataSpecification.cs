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
            var GenderText = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Gender")?.ItemId;
            var NameText = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Name")?.ItemId;
            var AgeText = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Age")?.ItemId;
            var Phone1Text = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Phone 1")?.ItemId;
            var Phone2Text = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Phone 2")?.ItemId;
            var NationalText = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "National ID")?.ItemId;

            if (!string.IsNullOrEmpty(searchText))
                AddCriteria(fc => fc.InternalNumber.Contains(searchText));
            if (!string.IsNullOrEmpty(addressText))
                AddCriteria(fc => fc.Governorate.Contains(addressText));
            if (!string.IsNullOrEmpty(GenderText))
                AddCriteria(fc => fc.Gender.Contains(GenderText));
            if (!string.IsNullOrEmpty(NameText))
                AddCriteria(fc => fc.Name.Contains(NameText));
            if (!string.IsNullOrEmpty(AgeText))
                AddCriteria(fc => fc.Age.ToString().Contains(AgeText));
            if (!string.IsNullOrEmpty(Phone1Text))
                AddCriteria(fc => fc.Phone1.Contains(Phone1Text));
            if (!string.IsNullOrEmpty(Phone2Text))
                AddCriteria(fc => fc.Phone2.Contains(Phone2Text));
            if (!string.IsNullOrEmpty(NationalText))
                AddCriteria(fc => fc.NationalId.Contains(NationalText));

            AddInclude(fc => fc.CreatedBy);

            ApplyOrderBy(fc => fc.InsertDate);
            if (applyPaging)
                ApplyPaging((PagingFilter.Currentpage - 1) * PagingFilter.Pagesize, PagingFilter.Pagesize);
        }
    }
}
