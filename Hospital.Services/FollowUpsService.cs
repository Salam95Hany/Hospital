using Hospital.Entities.Common;
using Hospital.Entities.Contracts.DTOs;
using Hospital.Entities.Models;
using Hospital.Entities.Specifications.FollowUps;
using Hospital.Entities.Specifications.SurgicalInterventions;
using Hospital.Interfaces;
using Hospital.Interfaces.Repositories;
using Hospital.Services.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Services
{
    public class FollowUpsService: IFollowUpsService
    {
        private readonly IUnitOfWork _unitOfWork;
        public FollowUpsService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponseModel<List<FollowUpDto>>> GetAllFollowUpData(int SurgicalInterventionId)
        {
            var Spec = new FollowUpDataSpecification(SurgicalInterventionId);
            var Results = await _unitOfWork.Repository<FollowUp>().GetAllWithSpecAsync(Spec);
            var Data = Results.Select(i => new FollowUpDto
            {
                FollowUpId = i.FollowUpId,
                SurgicalInterventionId = i.SurgicalInterventionId,
                AdmissionId = i.SurgicalInterventions.Admission.AdmissionId,
                PatientId = i.SurgicalInterventions.Admission.Patient.PatientId,
                FollowUpDate = i.FollowUpDate,
                PatientName = i.SurgicalInterventions.Admission.Patient.Name,
                CreatedBy = i.CreatedBy?.UserName,
                CreatedDate = i.InsertDate
            }).ToList();

            return ApiResponseModel<List<FollowUpDto>>.Success(GenericErrors.GetSuccess, Data);
        }

        public async Task<ApiResponseModel<FollowUp>> GetFollowUpById(int FollowUpId)
        {
            var Results = await _unitOfWork.Repository<FollowUp>().GetByIdAsync(FollowUpId);

            return ApiResponseModel<FollowUp>.Success(GenericErrors.GetSuccess, Results);
        }

        public async Task<ApiResponseModel<List<FilterModel>>> GetAllFollowUpFilters(int SurgicalInterventionId)
        {
            var Data = new List<FilterModel>
            {
                new FilterModel
                {
                    CategoryDisplayName = "Name",
                    CategoryName = "SearchText",
                    FilterType = "SearchText"
                }
            };

            return ApiResponseModel<List<FilterModel>>.Success(GenericErrors.GetSuccess, Data);
        }

        public async Task<ApiResponseModel<string>> AddNewFollowUp(FollowUp Model)
        {
            try
            {
                var followUp = new FollowUp
                {
                    SurgicalInterventionId = Model.SurgicalInterventionId,
                    FollowUpDate = Model.FollowUpDate,
                    PatientRemarksStatus = Model.PatientRemarksStatus,
                    PatientRemarksDetails = Model.PatientRemarksDetails,
                    ExaminationFindings = Model.ExaminationFindings,
                    WoundStatus = Model.WoundStatus,
                    Catheters = Model.Catheters,
                    LabResults = Model.LabResults,
                    ImagingResults = Model.ImagingResults,
                    ImagePath = Model.ImagePath,
                    Advice = Model.Advice,
                    NewDecision = Model.NewDecision,
                    NextFollowUpDate = Model.NextFollowUpDate,
                    IsDeleted = false,
                    InsertUser = Model.InsertUser,
                    InsertDate = DateTime.UtcNow
                };

                await _unitOfWork.Repository<FollowUp>().AddAsync(followUp);
                await _unitOfWork.CompleteAsync();

                return ApiResponseModel<string>.Success(GenericErrors.AddSuccess);
            }
            catch (Exception)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        public async Task<ApiResponseModel<string>> UpdateFollowUp(FollowUp Model)
        {
            try
            {
                var Entity = await _unitOfWork.Repository<FollowUp>().GetByIdAsync(Model.FollowUpId);

                if (Entity == null)
                    return ApiResponseModel<string>.Failure(GenericErrors.NotFound);

                Entity.FollowUpDate = Model.FollowUpDate;
                Entity.PatientRemarksStatus = Model.PatientRemarksStatus;
                Entity.PatientRemarksDetails = Model.PatientRemarksDetails;
                Entity.ExaminationFindings = Model.ExaminationFindings;
                Entity.WoundStatus = Model.WoundStatus;
                Entity.Catheters = Model.Catheters;
                Entity.LabResults = Model.LabResults;
                Entity.ImagingResults = Model.ImagingResults;
                Entity.ImagePath = Model.ImagePath;
                Entity.Advice = Model.Advice;
                Entity.NewDecision = Model.NewDecision;
                Entity.NextFollowUpDate = Model.NextFollowUpDate;
                Entity.UpdateUser = Model.UpdateUser;
                Entity.UpdateDate = DateTime.UtcNow;

                await _unitOfWork.CompleteAsync();

                return ApiResponseModel<string>.Success(GenericErrors.UpdateSuccess);
            }
            catch (Exception)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        public async Task<ApiResponseModel<string>> DeleteFollowUp(int FollowUpId)
        {
            try
            {
                var Entity = await _unitOfWork.Repository<FollowUp>().GetByIdAsync(FollowUpId);
                if (Entity == null)
                    return ApiResponseModel<string>.Failure(GenericErrors.NotFound);

                Entity.IsDeleted = true;

                await _unitOfWork.CompleteAsync();

                return ApiResponseModel<string>.Success(GenericErrors.DeleteSuccess);
            }
            catch (Exception)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }
    }
}
