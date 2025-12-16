using Hospital.Entities.Common;
using Hospital.Entities.Models;

namespace Hospital.Interfaces
{
    public interface IDoctorsService
    {
        Task<ApiResponseModel<List<Doctor>>> GetAllDoctorData(PagingFilterModel PagingFilter);
        Task<ApiResponseModel<string>> AddNewDoctor(Doctor Model);
        Task<ApiResponseModel<string>> UpdateDoctor(Doctor Model);
        Task<ApiResponseModel<string>> DeleteDoctor(int DoctorId);
        Task<bool> GetMainSurgeons(string filePath);

        Task<bool> GetMainSurgeons2(string filePath);
    }
}
