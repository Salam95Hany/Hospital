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
    public class FollowUpsController : ControllerBase
    {
        private readonly IFollowUpsService _followUpsService;
        public FollowUpsController(IFollowUpsService followUpsService)
        {
            _followUpsService = followUpsService;
        }

        [HttpGet("GetAllFollowUpData")]
        public async Task<ApiResponseModel<List<FollowUpDto>>> GetAllFollowUpData()
        {
            var results = await _followUpsService.GetAllFollowUpData();
            return results;
        }

        [HttpPost("AddNewFollowUp")]
        public async Task<ApiResponseModel<string>> AddNewFollowUp(FollowUp Model)
        {
            var results = await _followUpsService.AddNewFollowUp(Model);
            return results;
        }

        [HttpPost("UpdateFollowUp")]
        public async Task<ApiResponseModel<string>> UpdateFollowUp(FollowUp Model)
        {
            var results = await _followUpsService.UpdateFollowUp(Model);
            return results;
        }

        [HttpGet("DeleteFollowUp")]
        public async Task<ApiResponseModel<string>> DeleteFollowUp(int FollowUpId)
        {
            var results = await _followUpsService.DeleteFollowUp(FollowUpId);
            return results;
        }
    }
}
