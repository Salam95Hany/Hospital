using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Specifications.SearchAutoComplete
{
    public class SearchAutoCompleteSpecification : BaseSpecification<Patient>
    {
        public SearchAutoCompleteSpecification(string SearchText) : base(x => x.Name.Contains(SearchText))
        {

        }
    }
}
