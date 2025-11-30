using Hospital.Entities.Common;
using Hospital.Entities.Contracts.DTOs;
using Hospital.Entities.Models;
using Hospital.Entities.Specifications.Admissions;
using Hospital.Entities.Specifications.FollowUps;
using Hospital.Entities.Specifications.Patients;
using Hospital.Entities.Specifications.SurgicalInterventions;
using Hospital.Interfaces;
using Hospital.Interfaces.Repositories;
using Hospital.Services.Common;
using System.Threading;

namespace Hospital.Services
{
    public class AdmissionsService : IAdmissionsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAttachmentsService _attachmentsService;
        public AdmissionsService(IUnitOfWork unitOfWork, IAttachmentsService attachmentsService)
        {
            _unitOfWork = unitOfWork;
            _attachmentsService = attachmentsService;
        }

        public async Task<ApiResponseModel<List<AdmissionDto>>> GetAllAdmissionData(PagingFilterModel PagingFilter, int PatientId)
        {
            var DataSpec = new AdmissionDataSpecification(PagingFilter, PatientId);
            var CountSpec = new AdmissionDataSpecification(PagingFilter, PatientId, false);
            var Entity = _unitOfWork.Repository<Admission>();
            var TotalCount = await Entity.GetCountAsync(CountSpec);
            var Data = await Entity.GetAllWithSpecAsync(DataSpec);
            var Results = Data.Select(i => new AdmissionDto
            {
                AdmissionId = i.AdmissionId,
                PatientId = i.PatientId,
                AdmissionDate = i.AdmissionDate,
                DischargeDate = i.DischargeDate,
                HospitalFileNumber = i.HospitalFileNumber,
                PatientName = i.Patient?.Name,
                InternalNumber = i.Patient?.InternalNumber,
                CreatedBy = i.CreatedBy?.UserName,
                CreatedDate = i.InsertDate
            }).ToList();

            return ApiResponseModel<List<AdmissionDto>>.Success(GenericErrors.GetSuccess, Results, TotalCount);
        }

        public async Task<ApiResponseModel<Admission>> GetAdmissionById(int AdmissionId)
        {
            var Results = await _unitOfWork.Repository<Admission>().GetByIdAsync(AdmissionId);

            return ApiResponseModel<Admission>.Success(GenericErrors.GetSuccess, Results);
        }

        public async Task<ApiResponseModel<string>> AddNewAdmission(Admission Model)
        {
            try
            {
                var admission = new Admission
                {
                    PatientId = Model.PatientId,
                    HospitalFileNumber = Model.HospitalFileNumber,
                    AdmissionDate = Model.AdmissionDate,
                    DischargeDate = Model.DischargeDate,
                    ChiefComplaint = Model.ChiefComplaint,
                    Duration = Model.Duration,
                    HospitalBranch = Model.HospitalBranch,
                    HospitalStates = Model.HospitalStates,
                    Course = Model.Course,
                    HPI = Model.HPI,
                    Comorbidities = Model.Comorbidities,
                    CurrentMedications = Model.CurrentMedications,
                    PastHistory = Model.PastHistory,
                    FamilyHistory = Model.FamilyHistory,
                    BMI = Model.BMI,
                    Temperature = Model.Temperature,
                    Pulse = Model.Pulse,
                    BloodPressure = Model.BloodPressure,
                    GeneralExamination = Model.GeneralExamination,
                    AbdominalExamination = Model.AbdominalExamination,
                    GenitalExamination = Model.GenitalExamination,
                    DREVaginalExamination = Model.DREVaginalExamination,
                    UrineAnalysis = Model.UrineAnalysis,
                    CultureAndSensitivity = Model.CultureAndSensitivity,
                    SerumCreatinine = Model.SerumCreatinine,
                    Hemoglobin = Model.Hemoglobin,
                    TotalLeukocyteCount = Model.TotalLeukocyteCount,
                    Platelets = Model.Platelets,
                    PT_PTT_INR = Model.PT_PTT_INR,
                    LiverEnzymes = Model.LiverEnzymes,
                    FastingBloodSugar = Model.FastingBloodSugar,
                    PostPrandialBloodSugar = Model.PostPrandialBloodSugar,
                    HbA1c = Model.HbA1c,
                    PSATotal = Model.PSATotal,
                    PSAFree = Model.PSAFree,
                    PSARatio = Model.PSARatio,
                    OtherLabResults = Model.OtherLabResults,
                    PUT = Model.PUT,
                    Ultrasound = Model.Ultrasound,
                    TRUS = Model.TRUS,
                    CT = Model.CT,
                    MRI = Model.MRI,
                    IsotopeStudies = Model.IsotopeStudies,
                    OtherImaging = Model.OtherImaging,
                    ProvisionalDiagnosis = Model.ProvisionalDiagnosis,
                    MedicalDecision = Model.MedicalDecision,
                    ScheduledDate = Model.ScheduledDate,
                    IsDeleted = false,
                    InsertUser = null,
                    InsertDate = DateTime.UtcNow
                };

                await _unitOfWork.Repository<Admission>().AddAsync(admission);
                await _unitOfWork.CompleteAsync();

                if (Model.FileModel != null)
                {
                    Model.FileModel.InsertUser = "997d4e26-da04-4dd6-819b-bb745219694b";
                    Model.FileModel.ActionId = admission.AdmissionId;
                    Model.FileModel.ActionType = ActionTypes.Admission;
                    var Attachments = await _attachmentsService.AddActionFiles(Model.FileModel);
                }


                return ApiResponseModel<string>.Success(GenericErrors.AddSuccess);
            }
            catch (Exception)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        public async Task<ApiResponseModel<string>> UpdateAdmission(Admission Model)
        {
            try
            {
                var Entity = await _unitOfWork.Repository<Admission>().GetByIdAsync(Model.AdmissionId);
                if (Entity == null)
                    return ApiResponseModel<string>.Failure(GenericErrors.NotFound);

                Entity.PatientId = Model.PatientId;
                Entity.HospitalFileNumber = Model.HospitalFileNumber;
                Entity.AdmissionDate = Model.AdmissionDate;
                Entity.DischargeDate = Model.DischargeDate;
                Entity.ChiefComplaint = Model.ChiefComplaint;
                Entity.Duration = Model.Duration;
                Entity.HospitalBranch = Model.HospitalBranch;
                Entity.HospitalStates = Model.HospitalStates;
                Entity.Course = Model.Course;
                Entity.HPI = Model.HPI;
                Entity.Comorbidities = Model.Comorbidities;
                Entity.CurrentMedications = Model.CurrentMedications;
                Entity.PastHistory = Model.PastHistory;
                Entity.FamilyHistory = Model.FamilyHistory;
                Entity.BMI = Model.BMI;
                Entity.Temperature = Model.Temperature;
                Entity.Pulse = Model.Pulse;
                Entity.BloodPressure = Model.BloodPressure;
                Entity.GeneralExamination = Model.GeneralExamination;
                Entity.AbdominalExamination = Model.AbdominalExamination;
                Entity.GenitalExamination = Model.GenitalExamination;
                Entity.DREVaginalExamination = Model.DREVaginalExamination;
                Entity.UrineAnalysis = Model.UrineAnalysis;
                Entity.CultureAndSensitivity = Model.CultureAndSensitivity;
                Entity.SerumCreatinine = Model.SerumCreatinine;
                Entity.Hemoglobin = Model.Hemoglobin;
                Entity.TotalLeukocyteCount = Model.TotalLeukocyteCount;
                Entity.Platelets = Model.Platelets;
                Entity.PT_PTT_INR = Model.PT_PTT_INR;
                Entity.LiverEnzymes = Model.LiverEnzymes;
                Entity.FastingBloodSugar = Model.FastingBloodSugar;
                Entity.PostPrandialBloodSugar = Model.PostPrandialBloodSugar;
                Entity.HbA1c = Model.HbA1c;
                Entity.PSATotal = Model.PSATotal;
                Entity.PSAFree = Model.PSAFree;
                Entity.PSARatio = Model.PSARatio;
                Entity.OtherLabResults = Model.OtherLabResults;
                Entity.PUT = Model.PUT;
                Entity.Ultrasound = Model.Ultrasound;
                Entity.TRUS = Model.TRUS;
                Entity.CT = Model.CT;
                Entity.MRI = Model.MRI;
                Entity.IsotopeStudies = Model.IsotopeStudies;
                Entity.OtherImaging = Model.OtherImaging;
                Entity.ProvisionalDiagnosis = Model.ProvisionalDiagnosis;
                Entity.MedicalDecision = Model.MedicalDecision;
                Entity.ScheduledDate = Model.ScheduledDate;
                Entity.UpdateUser = null;
                Entity.UpdateDate = DateTime.UtcNow;

                await _unitOfWork.CompleteAsync();

                if (Model.FileModel != null)
                {
                    Model.FileModel.InsertUser = "997d4e26-da04-4dd6-819b-bb745219694b";
                    Model.FileModel.ActionId = Entity.AdmissionId;
                    Model.FileModel.ActionType = ActionTypes.Admission;
                    var Attachments = await _attachmentsService.AddActionFiles(Model.FileModel);
                }

                return ApiResponseModel<string>.Success(GenericErrors.UpdateSuccess);
            }
            catch (Exception)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        public async Task<ApiResponseModel<string>> DeleteAdmission(int AdmissionId)
        {
            await using var transaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                var SurgicalInterventionSpec = new SurgicalInterventionByAdmissionIdSpecification(AdmissionId);
                var Entity = await _unitOfWork.Repository<Admission>().GetByIdAsync(AdmissionId);
                if (Entity == null)
                    return ApiResponseModel<string>.Failure(GenericErrors.NotFound);

                var SurgicalEntity = await _unitOfWork.Repository<SurgicalIntervention>().GetAllWithSpecAsync(SurgicalInterventionSpec);

                if (SurgicalEntity.Count > 0)
                {
                    var SurgicalIds = SurgicalEntity.Select(i => i.SurgicalInterventionId).ToList();
                    var FollowUpSpec = new FollowupBySurgicalInterventionIdSpecification(SurgicalIds);
                    var FollowEntity = await _unitOfWork.Repository<FollowUp>().GetAllWithSpecAsync(FollowUpSpec);

                    FollowEntity.ForEach(i => i.IsDeleted = true);
                    SurgicalEntity.ForEach(i => i.IsDeleted = true);
                }

                Entity.IsDeleted = true;

                await _unitOfWork.CompleteAsync();
                await transaction.CommitAsync();

                return ApiResponseModel<string>.Success(GenericErrors.DeleteSuccess);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }
    }
}
