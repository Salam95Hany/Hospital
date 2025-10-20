using Hospital.Entities.Common;
using Hospital.Entities.Contracts.DTOs;
using Hospital.Entities.Contracts.Requests;
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
        public async Task<ApiResponseModel<string>> AddNewPatientFull(AddPatientFullModel Model)
        {
            var results = await _PatientsService.AddNewPatientFull(Model);
            return results;
        }

        [HttpGet("GetAllPatientsBasicInfo")]
        public async Task<ApiResponseModel<List<PatientListDto>>> GetAllPatientsBasicInfo(CancellationToken cancellationToken = default)
        {
            return await _PatientsService.GetAllPatientsBasicInfoAsync(cancellationToken);
        }
        [HttpPut("UpdatePatientFull")]
        public async Task<ApiResponseModel<string>> UpdatePatientFull(AddPatientFullModel Model)
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

        [HttpPost("GetSearchAutoCompleteData")]
        public async Task<ApiResponseModel<List<SearchAutoCompleteDto>>> GetSearchAutoCompleteData(SearchAutoCompleteRequest Model)
        {
            return await _PatientsService.GetSearchAutoCompleteData(Model);
        }

    }
}
