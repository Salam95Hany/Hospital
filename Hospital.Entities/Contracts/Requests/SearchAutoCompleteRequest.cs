using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Contracts.Requests
{
    public class SearchAutoCompleteRequest
    {
        public string SearchText { get; set; }
        public string SearchType { get; set; }
        public int? PatientId { get; set; }
        public int? AdmissionId { get; set; }
    }
}
