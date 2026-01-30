using Hospital.Entities.Common;
using Hospital.Interfaces.IPatients;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace Hospital.Controllers.PatientsController
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientSearchController : ControllerBase
    {
        private readonly IPatientSearchService _patientSearchService;
        public PatientSearchController(IPatientSearchService patientSearchService)
        {
            _patientSearchService = patientSearchService;
        }

        [HttpPost("GetPatientSearchData")]
        public async Task<ApiResponseModel<DataTable>> GetPatientSearchData(PagingFilterModel PagingFilter)
        {
            var results = await _patientSearchService.GetPatientSearchData(PagingFilter);
            return results;
        }

        [HttpPost("GetPatientSearchFilters")]
        public async Task<ApiResponseModel<List<FilterModel>>> GetPatientSearchFilters(List<FilterModel> FilterList)
        {
            var results = await _patientSearchService.GetPatientSearchFilters(FilterList);
            return results;
        }
    }
}
