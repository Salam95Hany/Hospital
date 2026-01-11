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
    public class FollowUpsController : ControllerBase
    {
        private readonly IFollowUpsService _followUpsService;
        public FollowUpsController(IFollowUpsService followUpsService)
        {
            _followUpsService = followUpsService;
        }

        [HttpPost("GetAllFollowUpData")]
        public async Task<ApiResponseModel<List<FollowUpDto>>> GetAllFollowUpData(PagingFilterModel PagingFilter, int AdmissionId)
        {
            var results = await _followUpsService.GetAllFollowUpData(PagingFilter, AdmissionId);
            return results;
        }

        [HttpGet("GetFollowUpById")]
        public async Task<ApiResponseModel<FollowUp>> GetFollowUpById(int FollowUpId)
        {
            var results = await _followUpsService.GetFollowUpById(FollowUpId);
            return results;
        }

        [HttpPost("AddNewFollowUp")]
        public async Task<ApiResponseModel<string>> AddNewFollowUp([FromForm] FollowUp Model)
        {
            var results = await _followUpsService.AddNewFollowUp(Model);
            return results;
        }

        [HttpPost("UpdateFollowUp")]
        public async Task<ApiResponseModel<string>> UpdateFollowUp([FromForm] FollowUp Model)
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
