using Hospital.Entities.Common;
using Hospital.Entities.Contracts.DTOs;
using Hospital.Entities.Models;
using Hospital.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdmissionsController : ControllerBase
    {
        private readonly IAdmissionsService _admissionsService;
        public AdmissionsController(IAdmissionsService admissionsService)
        {
            _admissionsService = admissionsService;
        }

        [HttpGet("GetAllAdmissionData")]
        public async Task<ApiResponseModel<List<AdmissionDto>>> GetAllAdmissionData(int PatientId)
        {
            var results = await _admissionsService.GetAllAdmissionData(PatientId);
            return results;
        }

        [HttpGet("GetAdmissionById")]
        public async Task<ApiResponseModel<Admission>> GetAdmissionById(int AdmissionId)
        {
            var results = await _admissionsService.GetAdmissionById(AdmissionId);
            return results;
        }

        [HttpGet("GetAllAdmissionFilters")]
        public async Task<ApiResponseModel<List<FilterModel>>> GetAllAdmissionFilters(int PatientId)
        {
            var results = await _admissionsService.GetAllAdmissionFilters(PatientId);
            return results;
        }

        [HttpPost("AddNewAdmission")]
        public async Task<ApiResponseModel<string>> AddNewAdmission([FromForm] Admission Model)
        {
            var results = await _admissionsService.AddNewAdmission(Model);
            return results;
        }

        [HttpPost("UpdateAdmission")]
        public async Task<ApiResponseModel<string>> UpdateAdmission([FromForm] Admission Model)
        {
            var results = await _admissionsService.UpdateAdmission(Model);
            return results;
        }

        [HttpGet("DeleteAdmission")]
        public async Task<ApiResponseModel<string>> DeleteAdmission(int AdmissionId)
        {
            var results = await _admissionsService.DeleteAdmission(AdmissionId);
            return results;
        }
    }
}
