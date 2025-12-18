using Hospital.Entities.Models;
using Hospital.Interfaces.Reports;
using Hospital.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Services.Reports
{
    public class ReportsDataService : IReportsDataService
    {
        private readonly IUnitOfWork _unitOfWork;
        public ReportsDataService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Dictionary<string, string>> GetAdmissionTempData(int? PatientId, int? AdmissionId, int? SurgicalId, int? FollowUpId)
        {
            var result = new Dictionary<string, string>();
            if (PatientId.HasValue)
            {
                var Patient = await _unitOfWork.Repository<Patient>().GetByIdAsync(PatientId.Value);
                AddProps(result, Patient);
            }
            if (AdmissionId.HasValue)
            {
                var Admission = await _unitOfWork.Repository<Admission>().GetByIdAsync(AdmissionId.Value);
                AddProps(result, Admission);
            }
            if (SurgicalId.HasValue)
            {
                var Surgical = await _unitOfWork.Repository<SurgicalIntervention>().GetByIdAsync(SurgicalId.Value);
                AddProps(result, Surgical);
            }
            if (FollowUpId.HasValue)
            {
                var FollowUp = await _unitOfWork.Repository<FollowUp>().GetByIdAsync(FollowUpId.Value);
                AddProps(result, FollowUp);
            }

            return result;
        }

        private void AddProps(Dictionary<string, string> dict, object entity)
        {
            if (entity == null) return;

            foreach (var prop in entity.GetType().GetProperties())
            {
                var value = prop.GetValue(entity);
                if (value == null) continue;

                if (!dict.ContainsKey(prop.Name))
                    dict.Add(prop.Name, value.ToString());
            }
        }
    }
}