using Hospital.Entities.Common;
using Hospital.Entities.Contracts.DTOs;
using Hospital.Entities.Models;
using Hospital.Interfaces;
using Hospital.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SurgicalInterventionsController : ControllerBase
    {
        private readonly ISurgicalInterventionsService _surgicalInterventionsService;
        public SurgicalInterventionsController(ISurgicalInterventionsService surgicalInterventionsService)
        {
            _surgicalInterventionsService = surgicalInterventionsService;
        }

        [HttpPost("GetAllSurgicalIntervention")]
        public async Task<ApiResponseModel<List<SurgicalInterventionDto>>> GetAllSurgicalIntervention(PagingFilterModel PagingFilter, int AdmissionId)
        {
            var results = await _surgicalInterventionsService.GetAllSurgicalIntervention(PagingFilter, AdmissionId);
            return results;
        }

        [HttpGet("GetAllSurgicalInterventionFilters")]
        public async Task<ApiResponseModel<List<FilterModel>>> GetAllSurgicalInterventionFilters(int AdmissionId)
        {
            var results = await _surgicalInterventionsService.GetAllSurgicalInterventionFilters(AdmissionId);
            return results;
        }

        [HttpGet("GetSurgicalInterventionById")]
        public async Task<ApiResponseModel<SurgicalIntervention>> GetSurgicalInterventionById(int SurgicalInterventionId)
        {
            var results = await _surgicalInterventionsService.GetSurgicalInterventionById(SurgicalInterventionId);
            return results;
        }

        [HttpPost("AddNewSurgicalIntervention")]
        public async Task<ApiResponseModel<string>> AddNewSurgicalIntervention([FromForm] SurgicalIntervention Model)
        {
            var results = await _surgicalInterventionsService.AddNewSurgicalIntervention(Model);
            return results;
        }

        [HttpPost("UpdateSurgicalIntervention")]
        public async Task<ApiResponseModel<string>> UpdateSurgicalIntervention([FromForm] SurgicalIntervention Model)
        {
            var results = await _surgicalInterventionsService.UpdateSurgicalIntervention(Model);
            return results;
        }

        [HttpGet("DeleteSurgicalIntervention")]
        public async Task<ApiResponseModel<string>> DeleteSurgicalIntervention(int SurgicalInterventionId)
        {
            var results = await _surgicalInterventionsService.DeleteSurgicalIntervention(SurgicalInterventionId);
            return results;
        }
    }
}
