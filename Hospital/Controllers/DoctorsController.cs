using Hospital.Entities.Common;
using Hospital.Entities.Models;
using Hospital.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly IDoctorsService _doctorsService;
        public DoctorsController(IDoctorsService doctorsService)
        {
            _doctorsService = doctorsService;
        }

        [HttpPost("GetAllDoctorData")]
        public async Task<ApiResponseModel<List<Doctor>>> GetAllDoctorData(PagingFilterModel PagingFilter)
        {
            var results = await _doctorsService.GetAllDoctorData(PagingFilter);
            return results;
        }

        [HttpPost("AddNewDoctor")]
        public async Task<ApiResponseModel<string>> AddNewDoctor(Doctor Model)
        {
            var results = await _doctorsService.AddNewDoctor(Model);
            return results;
        }

        [HttpPost("UpdateDoctor")]
        public async Task<ApiResponseModel<string>> UpdateDoctor(Doctor Model)
        {
            var results = await _doctorsService.UpdateDoctor(Model);
            return results;
        }

        [HttpGet("DeleteDoctor")]
        public async Task<ApiResponseModel<string>> DeleteDoctor(int DoctorId)
        {
            var results = await _doctorsService.DeleteDoctor(DoctorId);
            return results;
        }

        [HttpGet("GetMainSurgeons")]
        public async Task<bool> GetMainSurgeons(string filePath)
        {
            var results = await _doctorsService.GetMainSurgeons(filePath);
            return results;
        }
    }
}
