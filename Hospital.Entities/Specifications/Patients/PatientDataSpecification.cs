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
    public class PatientDataSpecification : BaseSpecification<Patient>
    {
        public PatientDataSpecification(PagingFilterModel PagingFilter, bool applyPaging = true) : base(i => i.IsDeleted == false)
        {

            var NameSearch = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Name")?.ItemId;
            var AgeSearch = int.TryParse(PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Age")?.ItemId, out var age) ? age : 0;
            var NationalIdSearch = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "NationalId")?.ItemId;
            var PhoneSearch = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Phone")?.ItemId;
            var Gender = PagingFilter.FilterList.Where(f => f.CategoryName == "Gender").Select(i => i.ItemId).ToList();
            var Governorate = PagingFilter.FilterList.Where(f => f.CategoryName == "Governorate").Select(i => i.ItemId).ToList();

            if (!string.IsNullOrEmpty(NameSearch))
                AddCriteria(fc => fc.Name.Contains(NameSearch));

            if (AgeSearch > 0)
                AddCriteria(fc => fc.Age == AgeSearch);

            if (!string.IsNullOrEmpty(NationalIdSearch))
                AddCriteria(fc => fc.NationalId.Contains(NationalIdSearch));

            if (!string.IsNullOrEmpty(PhoneSearch))
                AddCriteria(fc => fc.Phone1.Contains(PhoneSearch));

            if (Gender.Any())
                AddCriteria(fc => Gender.Contains(fc.Gender));

            if (Governorate.Any())
                AddCriteria(fc => Governorate.Contains(fc.Governorate));

            AddInclude(fc => fc.CreatedBy);

            ApplyOrderBy(fc => fc.InsertDate);
            if (applyPaging)
                ApplyPaging((PagingFilter.Currentpage - 1) * PagingFilter.Pagesize, PagingFilter.Pagesize);
        }
    }
}
