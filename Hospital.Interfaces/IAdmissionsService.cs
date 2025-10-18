using Hospital.Entities.Common;
using Hospital.Entities.Contracts.DTOs;
using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Interfaces
{
    public interface IAdmissionsService
    {
        Task<ApiResponseModel<List<AdmissionDto>>> GetAllAdmissionData();
        Task<ApiResponseModel<string>> AddNewAdmission(Admission Model);
        Task<ApiResponseModel<string>> UpdateAdmission(Admission Model);
        Task<ApiResponseModel<string>> DeleteAdmission(int AdmissionId);
    }
}
