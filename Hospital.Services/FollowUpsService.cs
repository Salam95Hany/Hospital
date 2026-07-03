using Hospital.Entities.Common;
using Hospital.Entities.Contracts.DTOs;
using Hospital.Entities.Models;
using Hospital.Entities.Specifications.FollowUps;
using Hospital.Interfaces;
using Hospital.Interfaces.Auth;
using Hospital.Interfaces.Repositories;
using Hospital.Services.Common;


namespace Hospital.Services
{
    public class FollowUpsService : IFollowUpsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAttachmentsService _attachmentsService;
        private readonly IAuthorizationService _authorizationService;
        public FollowUpsService(IUnitOfWork unitOfWork, IAttachmentsService attachmentsService, IAuthorizationService authorizationService)
        {
            _unitOfWork = unitOfWork;
            _attachmentsService = attachmentsService;
            _authorizationService = authorizationService;
        }

        public async Task<ApiResponseModel<List<FollowUpDto>>> GetAllFollowUpData(PagingFilterModel PagingFilter, int AdmissionId)
        {
            var DataSpec = new FollowUpDataSpecification(PagingFilter, AdmissionId);
            var CountSpec = new FollowUpDataSpecification(PagingFilter, AdmissionId, false);
            var Entity = _unitOfWork.Repository<FollowUp>();
            var TotalCount = await Entity.GetCountAsync(CountSpec);
            var Results = await Entity.GetAllWithSpecAsync(DataSpec);
            var Data = Results.Select(i => new FollowUpDto
            {
                FollowUpId = i.FollowUpId,
                AdmissionId = i.AdmissionId,
                PatientId = i.Admission.Patient.PatientId,
                FollowUpDate = i.FollowUpDate,
                PatientName = i.Admission.Patient.Name,
                InternalNumber = i.Admission.Patient.InternalNumber,
                CreatedBy = i.CreatedBy?.UserName,
                CreatedDate = i.InsertDate
            }).ToList();

            return ApiResponseModel<List<FollowUpDto>>.Success(GenericErrors.GetSuccess, Data, TotalCount);
        }

        public async Task<ApiResponseModel<List<FilterModel>>> GetAllFollowUpFilters(int AdmissionId)
        {
            var FinalFilters = new List<FilterModel>();
            var Spec = new FollowupByAdmissionIdSpecification(AdmissionId);
            var FollowUpData = await _unitOfWork.Repository<FollowUp>().GetAllAsQueryableAsync(Spec);

            var FilterRequests = new List<FilterRequest<FollowUp>>
            {
                new()
                {
                    CategoryDisplayName = "Patient’s remarks",
                    CategoryName = "Patient’s remarks",
                    FilterType = "Checkbox",
                    Source = FollowUpData,
                    ItemIdSelector = x => x.PatientRemarksStatus,
                    ItemKeySelector = x => x.PatientRemarksStatus
                }
            };

            var Filters = await FilterRequests.GenerateManyAsync();
            return ApiResponseModel<List<FilterModel>>.Success(GenericErrors.GetSuccess, Filters);
        }

        public async Task<ApiResponseModel<FollowUp>> GetFollowUpById(int FollowUpId)
        {
            var Results = await _unitOfWork.Repository<FollowUp>().GetByIdAsync(FollowUpId);

            return ApiResponseModel<FollowUp>.Success(GenericErrors.GetSuccess, Results);
        }

        public async Task<ApiResponseModel<string>> AddNewFollowUp(FollowUp Model)
        {
            try
            {
                var followUp = new FollowUp
                {
                    AdmissionId = Model.AdmissionId,
                    //SurgicalInterventionId = Model.SurgicalInterventionId,
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
                    FollowUpDoctor = Model.FollowUpDoctor,
                    FollowUpAppoint = Model.FollowUpAppoint,
                    NextFollowUpDate = Model.NextFollowUpDate,
                    IsDeleted = false,
                    InsertUser = Model.InsertUser,
                    InsertDate = DateTime.UtcNow
                };

                await _unitOfWork.Repository<FollowUp>().AddAsync(followUp);
                await _unitOfWork.CompleteAsync();

                if (Model.FileModel != null)
                {
                    Model.FileModel.InsertUser = "997d4e26-da04-4dd6-819b-bb745219694b";
                    Model.FileModel.ActionId = followUp.FollowUpId;
                    Model.FileModel.ActionType = ActionTypes.FollowUp;
                    var Attachments = await _attachmentsService.AddActionFiles(Model.FileModel);
                }

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

                if (!_authorizationService.CanEdit(Entity.InsertDate.Value))
                    return ApiResponseModel<string>.Failure(GenericErrors.EditingExpired);

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
                Entity.FollowUpDoctor = Model.FollowUpDoctor;
                Entity.FollowUpAppoint = Model.FollowUpAppoint;
                Entity.NewDecision = Model.NewDecision;
                Entity.NextFollowUpDate = Model.NextFollowUpDate;
                Entity.UpdateUser = Model.InsertUser;
                Entity.UpdateDate = DateTime.UtcNow;

                await _unitOfWork.CompleteAsync();

                if (Model.FileModel != null)
                {
                    Model.FileModel.InsertUser = "997d4e26-da04-4dd6-819b-bb745219694b";
                    Model.FileModel.ActionId = Entity.FollowUpId;
                    Model.FileModel.ActionType = ActionTypes.FollowUp;
                    var Attachments = await _attachmentsService.AddActionFiles(Model.FileModel);
                }

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
