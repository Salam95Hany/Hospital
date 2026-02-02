using Hospital.Entities.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Interfaces.IPatients
{
    public interface IPatientSearchService
    {
        Task<ApiResponseModel<DataTable>> GetPatientSearchData(PagingFilterModel PagingFilter);
        Task<ApiResponseModel<List<FilterModel>>> GetPatientSearchFilters(List<FilterModel> FilterList);
        Task<ApiResponseModel<DataTable>> GetExportPatientSearchData(List<FilterModel> FilterList);
    }
}
