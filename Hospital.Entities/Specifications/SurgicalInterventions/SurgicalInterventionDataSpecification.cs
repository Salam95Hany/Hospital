using Hospital.Entities.Common;
using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Specifications.SurgicalInterventions
{
    public class SurgicalInterventionDataSpecification : BaseSpecification<SurgicalIntervention>
    {
        public SurgicalInterventionDataSpecification(PagingFilterModel PagingFilter, int AdmissionId, bool applyPaging = true) : base(i => i.AdmissionId == AdmissionId && i.IsDeleted == false)
        {
            var InterventionDateFrom = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Date of intervention")?.From;
            var InterventionDateTo = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Date of intervention")?.To;

            var FollowUpAppointmentFrom = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Follow-up Appointment")?.From;
            var FollowUpAppointmentTo = PagingFilter.FilterList.FirstOrDefault(f => f.CategoryName == "Follow-up Appointment")?.To;

            var MainSurgeon = PagingFilter.FilterList.Where(f => f.CategoryName == "Main surgeon").Select(f => f.ItemId).ToList();

            var Assistants = PagingFilter.FilterList.Where(f => f.CategoryName == "Assistants").Select(f => f.ItemId).ToList();

            var Resident = PagingFilter.FilterList.Where(f => f.CategoryName == "Resident").Select(f => f.ItemId).ToList();

            var Category = PagingFilter.FilterList.Where(f => f.CategoryName == "Category").Select(f => f.ItemId).ToList();

            var Approach = PagingFilter.FilterList.Where(f => f.CategoryName == "Approach").Select(f => f.ItemId).ToList();

            var Organ = PagingFilter.FilterList.Where(f => f.CategoryName == "Organ").Select(f => f.ItemId).ToList();

            var Theatre = PagingFilter.FilterList.Where(f => f.CategoryName == "Theatre").Select(f => f.ItemId).ToList();

            var Anesthesia = PagingFilter.FilterList.Where(f => f.CategoryName == "Anesthesia").Select(f => f.ItemId).ToList();

            var IntraOperativeCourse = PagingFilter.FilterList.Where(f => f.CategoryName == "Intra-operative course").Select(f => f.ItemId).ToList();

            var Postopday_0_1 = PagingFilter.FilterList.Where(f => f.CategoryName == "Post-op day 0-1").Select(f => f.ItemId).ToList();

            if (InterventionDateFrom != null && InterventionDateTo != null)
                AddCriteria(fc => fc.InterventionDate >= DateTime.Parse(InterventionDateFrom) && fc.InterventionDate <= DateTime.Parse(InterventionDateTo));

            if (FollowUpAppointmentFrom != null && FollowUpAppointmentTo != null)
                AddCriteria(fc => fc.FollowUpAppointment >= DateTime.Parse(FollowUpAppointmentFrom) && fc.FollowUpAppointment <= DateTime.Parse(FollowUpAppointmentTo));

            if (MainSurgeon.Any())
                AddCriteria(fc => MainSurgeon.Any(ms => fc.MainSurgeon.Contains(ms)));

            if (Assistants.Any())
                AddCriteria(fc => Assistants.Any(ms => fc.Assistants.Contains(ms)));

            if (Resident.Any())
                AddCriteria(fc => Resident.Any(ms => fc.Resident.Contains(ms)));

            if (Category.Any())
                AddCriteria(fc => Category.Any(ms => fc.Category.Contains(ms)));

            if (Approach.Any())
                AddCriteria(fc => Approach.Any(ms => fc.Approach.Contains(ms)));

            if (Organ.Any())
                AddCriteria(fc => Organ.Any(ms => fc.Organ.Contains(ms)));

            if (Theatre.Any())
                AddCriteria(fc => Theatre.Contains(fc.Theater));

            if (Anesthesia.Any())
                AddCriteria(fc => Anesthesia.Contains(fc.Anesthesia));

            if (IntraOperativeCourse.Any())
                AddCriteria(fc => IntraOperativeCourse.Contains(fc.IntraOperativeCourse));

            if (Postopday_0_1.Any())
                AddCriteria(fc => Postopday_0_1.Contains(fc.PostOpDay0_1));

            AddInclude("Admission.Patient");
            AddInclude(i => i.CreatedBy);

            ApplyOrderBy(fc => fc.InsertDate);
            if (applyPaging)
                ApplyPaging((PagingFilter.Currentpage - 1) * PagingFilter.Pagesize, PagingFilter.Pagesize);
        }
    }
}
