using Hospital.Entities.Common;
using Hospital.Entities.Contracts.DTOs;
using Hospital.Entities.Contracts.Requests;
using Hospital.Entities.Models;
using Hospital.Interfaces.IPatients;
using Hospital.Services.PatientsService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Controllers.PatientsController
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientsService _PatientsService;

        public PatientsController(IPatientsService PatientsService)
        {
            ;
            _PatientsService = PatientsService;
        }
        [HttpPost("AddNewPatientFull")]
        public async Task<ApiResponseModel<string>> AddNewPatientFull([FromForm]AddPatientFullModel Model)
        {
            var results = await _PatientsService.AddNewPatientFull(Model);
            return results;
        }

        [HttpPost("GetAllPatientsBasicInfo")]
        public async Task<ApiResponseModel<List<PatientListDto>>> GetAllPatientsBasicInfo(PagingFilterModel PagingFilter, CancellationToken cancellationToken = default)
        {
            return await _PatientsService.GetAllPatientsBasicInfoAsync(PagingFilter, cancellationToken);
        }

        [HttpGet("GetAllPatientFilters")]
        public async Task<ApiResponseModel<List<FilterModel>>> GetAllPatientFilters()
        {
            return await _PatientsService.GetAllPatientFilters();
        }

        //[HttpGet("GetAllPatientsBasicInfoFilter")]
        //public async Task<ApiResponseModel<List<FilterModel>>> GetAllPatientsBasicInfoFilter()
        //{
        //    var results = await _PatientsService.GetAllPatientsBasicInfoFilter();
        //    return results;
        //}
        [HttpPut("UpdatePatientFull")]
        public async Task<ApiResponseModel<string>> UpdatePatientFull([FromForm]Patient Model)
        {
            return await _PatientsService.UpdatePatientFull(Model);
        }

        [HttpDelete("DeletePatientWithAllData/{patientId}")]
        public async Task<ApiResponseModel<string>> DeletePatientWithAllData(int patientId)
        {
            return await _PatientsService.SoftDeletePatientWithAllData(patientId);
        }

        [HttpGet("GetPatientByIdWithInclude/{patientId}")]
        public async Task<ApiResponseModel<PatientFullDetailsDto>> GetPatientByIdWithInclude(int patientId, CancellationToken cancellationToken = default)
        {
            return await _PatientsService.GetPatientByIdWithIncludeAsync(patientId, cancellationToken);
        }

        [HttpGet("GetPatientWithLastDetailsAsync/{patientId}")]
        public async Task<ApiResponseModel<PatientLastDetailsDto>> GetPatientWithLastDetailsAsync(int patientId, CancellationToken cancellationToken = default)
        {
            return await _PatientsService.GetPatientWithLastDetailsAsync(patientId, cancellationToken);
        }

        [HttpPost("GetSearchAutoCompleteData")]
        public async Task<ApiResponseModel<List<SearchAutoCompleteDto>>> GetSearchAutoCompleteData(SearchAutoCompleteRequest Model)
        {
            return await _PatientsService.GetSearchAutoCompleteData(Model);
        }

        [HttpGet("GetFilesByActionId")]
        public async Task<ApiResponseModel<List<Attachment>>> GetFilesByActionId(int ActionId, ActionTypes ActionType)
        {
            return await _PatientsService.GetFilesByActionId(ActionId, ActionType);
        }
        
        [HttpGet("GetDashboardStatistics")]
        public async Task<ApiResponseModel<DashboardCardDto>> GetDashboardStatistics()
        {
            return await _PatientsService.GetDashboardStatistics();
        }
        [HttpGet("GetHospitalFileNumber")]
        public async Task<List<Admission>> GetHospitalFileNumber(string hospitalFileNumber)
        {
            return await _PatientsService.GetHospitalFileNumber(hospitalFileNumber);
        }


    }
}
