using Hospital.Entities.Common;
using Hospital.Entities.Contracts.DTOs;
using Hospital.Entities.Models;
using Hospital.Entities.Specifications.FollowUps;
using Hospital.Entities.Specifications.SurgicalInterventions;
using Hospital.Interfaces;
using Hospital.Interfaces.Repositories;
using Hospital.Services.Common;

namespace Hospital.Services
{
    public class SurgicalInterventionsService : ISurgicalInterventionsService
    {
        private readonly IUnitOfWork _unitOfWork;
        public SurgicalInterventionsService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponseModel<List<SurgicalInterventionDto>>> GetAllSurgicalIntervention()
        {
            var Spec = new SurgicalInterventionDataSpecification();
            var Results = await _unitOfWork.Repository<SurgicalIntervention>().GetAllWithSpecAsync(Spec);
            var Data = Results.Select(i => new SurgicalInterventionDto
            {
                SurgicalInterventionId = i.SurgicalInterventionId,
                AdmissionId = i.AdmissionId,
                PatientId = i.Admission.PatientId,
                InterventionDate = i.InterventionDate,
                Theater = i.Theater,
                CreatedBy = i.CreatedBy.UserName
            }).ToList();

            return ApiResponseModel<List<SurgicalInterventionDto>>.Success(GenericErrors.GetSuccess, Data);
        }

        public async Task<ApiResponseModel<string>> AddNewSurgicalIntervention(SurgicalIntervention Model)
        {
            try
            {
                var surgicalIntervention = new SurgicalIntervention
                {
                    AdmissionId = Model.AdmissionId,
                    InterventionDate = Model.InterventionDate,
                    Theater = Model.Theater,
                    MainSurgeon = Model.MainSurgeon,
                    Assistants = Model.Assistants,
                    Resident = Model.Resident,
                    OtherSurgeons = Model.OtherSurgeons,
                    OffFieldSupervisor = Model.OffFieldSupervisor,
                    Anesthesia = Model.Anesthesia,
                    Intervention = Model.Intervention,
                    InterventionDetails = Model.InterventionDetails,
                    TubesFixed = Model.TubesFixed,
                    Category = Model.Category,
                    Approach = Model.Approach,
                    Organ = Model.Organ,
                    IntraOperativeCourse = Model.IntraOperativeCourse,
                    IntraOpAdverseEvents = Model.IntraOpAdverseEvents,
                    BloodTransfusionUnits = Model.BloodTransfusionUnits,
                    PostOpRecommendations = Model.PostOpRecommendations,
                    PostOpDay0_1 = Model.PostOpDay0_1,
                    PostOpDay2_5 = Model.PostOpDay2_5,
                    PostOpDayOver5 = Model.PostOpDayOver5,
                    PostOpAdverseEvents = Model.PostOpAdverseEvents,
                    DischargeDate = Model.DischargeDate,
                    FinalDiagnosis = Model.FinalDiagnosis,
                    DischargeInstructions = Model.DischargeInstructions,
                    FollowUpDoctor = Model.FollowUpDoctor,
                    FollowUpDoctorPhone = Model.FollowUpDoctorPhone,
                    FollowUpAppointment = Model.FollowUpAppointment,
                    InsertUser = Model.InsertUser,
                    InsertDate = DateTime.UtcNow
                };

                await _unitOfWork.Repository<SurgicalIntervention>().AddAsync(surgicalIntervention);
                await _unitOfWork.CompleteAsync();

                return ApiResponseModel<string>.Success(GenericErrors.AddSuccess);
            }
            catch (Exception)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        public async Task<ApiResponseModel<string>> UpdateSurgicalIntervention(SurgicalIntervention Model)
        {
            try
            {
                var Entity = await _unitOfWork.Repository<SurgicalIntervention>().GetByIdAsync(Model.SurgicalInterventionId);

                if (Entity == null)
                    return ApiResponseModel<string>.Failure(GenericErrors.NotFound);

                Entity.InterventionDate = Model.InterventionDate;
                Entity.Theater = Model.Theater;
                Entity.MainSurgeon = Model.MainSurgeon;
                Entity.Assistants = Model.Assistants;
                Entity.Resident = Model.Resident;
                Entity.OtherSurgeons = Model.OtherSurgeons;
                Entity.OffFieldSupervisor = Model.OffFieldSupervisor;
                Entity.Anesthesia = Model.Anesthesia;
                Entity.Intervention = Model.Intervention;
                Entity.InterventionDetails = Model.InterventionDetails;
                Entity.TubesFixed = Model.TubesFixed;
                Entity.Category = Model.Category;
                Entity.Approach = Model.Approach;
                Entity.Organ = Model.Organ;
                Entity.IntraOperativeCourse = Model.IntraOperativeCourse;
                Entity.IntraOpAdverseEvents = Model.IntraOpAdverseEvents;
                Entity.BloodTransfusionUnits = Model.BloodTransfusionUnits;
                Entity.PostOpRecommendations = Model.PostOpRecommendations;
                Entity.PostOpDay0_1 = Model.PostOpDay0_1;
                Entity.PostOpDay2_5 = Model.PostOpDay2_5;
                Entity.PostOpDayOver5 = Model.PostOpDayOver5;
                Entity.PostOpAdverseEvents = Model.PostOpAdverseEvents;
                Entity.DischargeDate = Model.DischargeDate;
                Entity.FinalDiagnosis = Model.FinalDiagnosis;
                Entity.DischargeInstructions = Model.DischargeInstructions;
                Entity.FollowUpDoctor = Model.FollowUpDoctor;
                Entity.FollowUpDoctorPhone = Model.FollowUpDoctorPhone;
                Entity.FollowUpAppointment = Model.FollowUpAppointment;
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

        public async Task<ApiResponseModel<string>> DeleteSurgicalIntervention(int SurgicalInterventionId)
        {
            await using var transaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                var Entity = await _unitOfWork.Repository<SurgicalIntervention>().GetByIdAsync(SurgicalInterventionId);
                if (Entity == null)
                    return ApiResponseModel<string>.Failure(GenericErrors.NotFound);

                var FollowUpSpec = new FollowupBySurgicalInterventionIdSpecification(new List<int> { SurgicalInterventionId });
                var FollowEntity = await _unitOfWork.Repository<FollowUp>().GetAllWithSpecAsync(FollowUpSpec);

                if (FollowEntity.Count > 0)
                    FollowEntity.ForEach(i => i.IsDeleted = true);

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
