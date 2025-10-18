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
    public class SurgicalInterventionsController : ControllerBase
    {
        private readonly ISurgicalInterventionsService _surgicalInterventionsService;
        public SurgicalInterventionsController(ISurgicalInterventionsService surgicalInterventionsService)
        {
            _surgicalInterventionsService = surgicalInterventionsService;
        }

        [HttpGet("GetAllSurgicalIntervention")]
        public async Task<ApiResponseModel<List<SurgicalInterventionDto>>> GetAllSurgicalIntervention()
        {
            var results = await _surgicalInterventionsService.GetAllSurgicalIntervention();
            return results;
        }

        [HttpPost("AddNewSurgicalIntervention")]
        public async Task<ApiResponseModel<string>> AddNewSurgicalIntervention(SurgicalIntervention Model)
        {
            var results = await _surgicalInterventionsService.AddNewSurgicalIntervention(Model);
            return results;
        }

        [HttpPost("UpdateSurgicalIntervention")]
        public async Task<ApiResponseModel<string>> UpdateSurgicalIntervention(SurgicalIntervention Model)
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
