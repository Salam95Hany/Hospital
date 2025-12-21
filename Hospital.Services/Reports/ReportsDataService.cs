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

        //public async Task<Dictionary<string, string>> GetAdmissionTempData(int? PatientId, int? AdmissionId, int? SurgicalId, int? FollowUpId)
        //{
        //    var result = new Dictionary<string, string>();
        //    if (PatientId.HasValue)
        //    {
        //        var Patient = await _unitOfWork.Repository<Patient>().GetByIdAsync(PatientId.Value);
        //        AddProps(result, Patient);
        //    }
        //    if (AdmissionId.HasValue)
        //    {
        //        var Admission = await _unitOfWork.Repository<Admission>().GetByIdAsync(AdmissionId.Value);
        //        AddProps(result, Admission);
        //    }
        //    if (SurgicalId.HasValue)
        //    {
        //        var Surgical = await _unitOfWork.Repository<SurgicalIntervention>().GetByIdAsync(SurgicalId.Value);
        //        AddProps(result, Surgical);
        //    }
        //    if (FollowUpId.HasValue)
        //    {
        //        var FollowUp = await _unitOfWork.Repository<FollowUp>().GetByIdAsync(FollowUpId.Value);
        //        AddProps(result, FollowUp);
        //    }

        //    return result;
        //}
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

                if (Surgical != null)
                {
                    // Collect all doctor IDs from the comma-separated strings
                    var allDoctorIds = new List<int>();

                    if (!string.IsNullOrEmpty(Surgical.MainSurgeon))
                        allDoctorIds.AddRange(Surgical.MainSurgeon.Split(',').Select(id => int.Parse(id.Trim())));

                    if (!string.IsNullOrEmpty(Surgical.Assistants))
                        allDoctorIds.AddRange(Surgical.Assistants.Split(',').Select(id => int.Parse(id.Trim())));

                    if (!string.IsNullOrEmpty(Surgical.Resident))
                        allDoctorIds.AddRange(Surgical.Resident.Split(',').Select(id => int.Parse(id.Trim())));

                    if (!string.IsNullOrEmpty(Surgical.OffFieldSupervisor))
                        allDoctorIds.AddRange(Surgical.OffFieldSupervisor.Split(',').Select(id => int.Parse(id.Trim())));

                    // Remove duplicates
                    allDoctorIds = allDoctorIds.Distinct().ToList();

                    if (allDoctorIds.Any())
                    {
                        // Fetch all doctors in one query
                        var doctors = await _unitOfWork.Repository<Doctor>()
                            .WhereAsync(d => allDoctorIds.Contains(d.DoctorId) && !d.IsDeleted);

                        // Create a dictionary for quick lookup
                        var doctorDictionary = doctors.ToDictionary(d => d.DoctorId, d => d);

                        // Helper method to get doctor names with academic degree
                        string GetDoctorNames(string? doctorIds)
                        {
                            if (string.IsNullOrEmpty(doctorIds))
                                return string.Empty;

                            var names = doctorIds.Split(',')
                                .Select(id => int.Parse(id.Trim()))
                                .Where(id => doctorDictionary.ContainsKey(id))
                                .Select(id =>
                                {
                                    var doctor = doctorDictionary[id];
                                    return string.IsNullOrEmpty(doctor.AcademicDegree)
                                        ? doctor.DoctorName
                                        : $"{doctor.DoctorName}";
                                })
                                .ToList();

                            return string.Join(", ", names);
                        }

                        // Add doctor names to the dictionary for PDF display
                        result["MainSurgeon"] = GetDoctorNames(Surgical.MainSurgeon);
                        result["Assistants"] = GetDoctorNames(Surgical.Assistants);
                        result["Resident"] = GetDoctorNames(Surgical.Resident);
                        result["OffFieldSupervisor"] = GetDoctorNames(Surgical.OffFieldSupervisor);
                    }

                    AddProps(result, Surgical);
                }
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