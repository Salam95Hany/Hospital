using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Common
{
    public class PatientFullDetailsDto
    {
        public Patient Patient { get; set; }
        public List<Admission> Admissions { get; set; } = new List<Admission>();
        public List<SurgicalIntervention> SurgicalInterventions { get; set; } = new List<SurgicalIntervention>();
        public List<FollowUp> FollowUps { get; set; } = new List<FollowUp>();
    }
    public class PatientLastDetailsDto
    {
        public Patient Patient { get; set; }
        public Admission LastAdmission { get; set; }
        public SurgicalIntervention LastSurgicalIntervention { get; set; }
        public FollowUp LastFollowUp { get; set; }
    }

    public class DoctorDetailsDto
    {
        public int DoctorId { get; set; }
        public string DoctorName { get; set; }
        public string? AcademicDegree { get; set; }
    }
}
