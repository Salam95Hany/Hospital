using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Contracts.DTOs
{
    public class DashboardCardDto
    {
        public int Patients { get; set; }
        public int Doctors { get; set; }
        public int Admissions { get; set; }
        public int SurgicalInterventions { get; set; }
        public int FollowUps { get; set; }
    }
}
