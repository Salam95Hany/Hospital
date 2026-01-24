using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Common
{
    public class PatientListDto
    {
        public int Id { get; set; }
        public string InternalNumber { get; set; }
        public string Name { get; set; }
        public int? Age { get; set; }
        public string Governorate { get; set; }
        public string Gender { get; set; }
        public string Phone1 { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

    }
}
