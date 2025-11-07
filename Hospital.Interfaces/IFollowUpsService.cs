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
    public interface IFollowUpsService
    {
        Task<ApiResponseModel<List<FollowUpDto>>> GetAllFollowUpData(PagingFilterModel PagingFilter, int SurgicalInterventionId);
        Task<ApiResponseModel<FollowUp>> GetFollowUpById(int FollowUpId);
        Task<ApiResponseModel<string>> AddNewFollowUp(FollowUp Model);
        Task<ApiResponseModel<string>> UpdateFollowUp(FollowUp Model);
        Task<ApiResponseModel<string>> DeleteFollowUp(int FollowUpId);
    }
}
