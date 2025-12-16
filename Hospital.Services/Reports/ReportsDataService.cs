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

        public async Task<Dictionary<string, string>> GetAdmissionTempData(int PatientId, int AdmissionId, int SurgicalId)
        {
            var Patient = await _unitOfWork.Repository<Patient>().GetByIdAsync(PatientId);
            var Admission = await _unitOfWork.Repository<Admission>().GetByIdAsync(AdmissionId);
            var Surgical = await _unitOfWork.Repository<SurgicalIntervention>().GetByIdAsync(SurgicalId);

            var result = new Dictionary<string, string>();

            AddProps(result, Patient);
            AddProps(result, Admission);
            AddProps(result, Surgical);

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