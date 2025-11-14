using Hospital.Entities.Common;
using Hospital.Entities.Contracts.DTOs;
using Hospital.Entities.Contracts.Requests;
using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Interfaces.IPatients
{
    public interface IPatientsService
    {
        Task<ApiResponseModel<List<PatientListDto>>> GetAllPatientsBasicInfoAsync(PagingFilterModel PagingFilter, CancellationToken cancellationToken = default);
        Task<ApiResponseModel<string>> AddNewPatientFull(AddPatientFullModel Model, CancellationToken cancellationToken = default);
        Task<ApiResponseModel<string>> DeletePatientWithAllData(int patientId, CancellationToken cancellationToken = default);
        Task<ApiResponseModel<string>> SoftDeletePatientWithAllData(int patientId, CancellationToken cancellationToken = default);
        Task<ApiResponseModel<string>> UpdatePatientFull(Patient Model, CancellationToken cancellationToken = default);
        Task<ApiResponseModel<PatientFullDetailsDto>> GetPatientByIdWithIncludeAsync(int patientId, CancellationToken cancellationToken = default);
        Task<ApiResponseModel<List<SearchAutoCompleteDto>>> GetSearchAutoCompleteData(SearchAutoCompleteRequest Model);
        Task<ApiResponseModel<List<Attachment>>> GetFilesByActionId(int ActionId, ActionTypes ActionType);
        Task<ApiResponseModel<DashboardCardDto>> GetDashboardStatistics();
        Task<Patient> GetPatientByInternalNumber(string internalNumber);
        Task<List<Admission>> GetHospitalFileNumber(string hospitalFileNumber);
    }
}
