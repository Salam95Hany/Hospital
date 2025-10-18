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
    public interface ISurgicalInterventionsService
    {
        Task<ApiResponseModel<List<SurgicalInterventionDto>>> GetAllSurgicalIntervention();
        Task<ApiResponseModel<string>> AddNewSurgicalIntervention(SurgicalIntervention Model);
        Task<ApiResponseModel<string>> UpdateSurgicalIntervention(SurgicalIntervention Model);
        Task<ApiResponseModel<string>> DeleteSurgicalIntervention(int SurgicalInterventionId);
    }
}
