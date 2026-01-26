using Hospital.Entities.Common;
using Hospital.Entities.Contracts.DTOs;
using Hospital.Entities.Models;
using Hospital.Entities.Specifications.FollowUps;
using Hospital.Entities.Specifications.SurgicalInterventions;
using Hospital.Interfaces;
using Hospital.Interfaces.Repositories;
using Hospital.Services.Common;
using Microsoft.EntityFrameworkCore;

namespace Hospital.Services
{
    public class SurgicalInterventionsService : ISurgicalInterventionsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAttachmentsService _attachmentsService;
        public SurgicalInterventionsService(IUnitOfWork unitOfWork, IAttachmentsService attachmentsService)
        {
            _unitOfWork = unitOfWork;
            _attachmentsService = attachmentsService;
        }

        public async Task<ApiResponseModel<List<SurgicalInterventionDto>>> GetAllSurgicalIntervention(PagingFilterModel PagingFilter, int AdmissionId)
        {
            try
            {
                var DataSpec = new SurgicalInterventionDataSpecification(PagingFilter, AdmissionId);
                var CountSpec = new SurgicalInterventionDataSpecification(PagingFilter, AdmissionId, false);
                var Entity = _unitOfWork.Repository<SurgicalIntervention>();
                var TotalCount = await Entity.GetCountAsync(CountSpec);
                var Results = await Entity.GetAllWithSpecAsync(DataSpec);

                var Data = Results.Select(i => new SurgicalInterventionDto
                {
                    SurgicalInterventionId = i.SurgicalInterventionId,
                    AdmissionId = i.AdmissionId,
                    PatientId = i.Admission.PatientId,
                    PatientName = i.Admission?.Patient?.Name,
                    InternalNumber = i.Admission?.Patient?.InternalNumber,
                    InterventionDate = i.InterventionDate,
                    Theater = i.Theater,
                    CreatedBy = i.CreatedBy?.UserName,
                    CreatedDate = i.InsertDate,
                }).ToList();

                return ApiResponseModel<List<SurgicalInterventionDto>>.Success(GenericErrors.GetSuccess, Data, TotalCount);
            }
            catch (Exception ex)
            {
                throw;
            }
            
        }

        public async Task<ApiResponseModel<List<FilterModel>>> GetAllSurgicalInterventionFilters(int AdmissionId)
        {
            var FinalFilters = new List<FilterModel>();
            var Spec = new SurgicalInterventionByAdmissionIdSpecification(AdmissionId);
            var surgicalData = await _unitOfWork.Repository<SurgicalIntervention>().GetAllAsQueryableAsync(Spec);

            if (surgicalData.Count == 0)
                return new ApiResponseModel<List<FilterModel>>();

            var doctors = await _unitOfWork.Repository<Doctor>().GetAllAsQueryable().ToDictionaryAsync(x => x.DoctorId.ToString(), x => x.DoctorName);

            var MainsurgeonDoctor = surgicalData.Where(x => !string.IsNullOrEmpty(x.MainSurgeon)).SelectMany(x => x.MainSurgeon.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(id => new Doctor
                    {
                        DoctorId = int.Parse(id),
                        DoctorName = doctors.ContainsKey(id.Trim()) ? doctors[id.Trim()] : "-"
                    })).ToList();

            var AssistantsDoctor = surgicalData.Where(x => !string.IsNullOrEmpty(x.Assistants)).SelectMany(x => x.Assistants.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(id => new Doctor
                    {
                        DoctorId = int.Parse(id),
                        DoctorName = doctors.ContainsKey(id.Trim()) ? doctors[id.Trim()] : "-"
                    })).ToList();

            var ResidentsDoctor = surgicalData.Where(x => !string.IsNullOrEmpty(x.Resident)).SelectMany(x => x.Resident.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(id => new Doctor
                    {
                        DoctorId = int.Parse(id),
                        DoctorName = doctors.ContainsKey(id.Trim()) ? doctors[id.Trim()] : "-"
                    })).ToList();

            var Categories = surgicalData.Where(x => !string.IsNullOrEmpty(x.Category)).SelectMany(x => x.Category.Split(',', StringSplitOptions.RemoveEmptyEntries)
                   .Select(id => new SurgicalIntervention
                   {
                       SurgicalInterventionId = x.SurgicalInterventionId,
                       Category = id
                   })).ToList();

            var Approaches = surgicalData.Where(x => !string.IsNullOrEmpty(x.Approach)).SelectMany(x => x.Approach.Split(',', StringSplitOptions.RemoveEmptyEntries)
                   .Select(id => new SurgicalIntervention
                   {
                       SurgicalInterventionId = x.SurgicalInterventionId,
                       Approach = id
                   })).ToList();

            var Organs = surgicalData.Where(x => !string.IsNullOrEmpty(x.Organ)).SelectMany(x => x.Organ.Split(',', StringSplitOptions.RemoveEmptyEntries)
                  .Select(id => new SurgicalIntervention
                  {
                      SurgicalInterventionId = x.SurgicalInterventionId,
                      Organ = id
                  })).ToList();

            var OtherFilterRequests = new List<FilterRequest<SurgicalIntervention>>
            {
                new()
                {
                    CategoryDisplayName = "Date of intervention",
                    CategoryName = "Date of intervention",
                    FilterType = "DateRange",
                    DisplayOrder = 1
                },
                new()
                {
                    CategoryDisplayName = "Follow-up Appointment",
                    CategoryName = "Follow-up Appointment",
                    FilterType = "DateRange",
                    DisplayOrder = 2
                },
                new()
                {
                    CategoryDisplayName = "Theatre",
                    CategoryName = "Theatre",
                    FilterType = "Checkbox",
                    Source = surgicalData,
                    ItemIdSelector = x => x.Theater,
                    ItemKeySelector = x => x.Theater,
                    DisplayOrder = 3
                },
                new()
                {
                    CategoryDisplayName = "Anesthesia",
                    CategoryName = "Anesthesia",
                    FilterType = "Checkbox",
                    Source = surgicalData,
                    ItemIdSelector = x => x.Anesthesia,
                    ItemKeySelector = x => x.Anesthesia,
                    DisplayOrder = 7
                },
                new()
                {
                    CategoryDisplayName = "Intra-operative course",
                    CategoryName = "Intra-operative course",
                    FilterType = "Checkbox",
                    Source = surgicalData,
                    ItemIdSelector = x => x.IntraOperativeCourse,
                    ItemKeySelector = x => x.IntraOperativeCourse,
                    DisplayOrder = 11
                },
                new()
                {
                    CategoryDisplayName = "Post-op day 0-1",
                    CategoryName = "Post-op day 0-1",
                    FilterType = "Checkbox",
                    Source = surgicalData,
                    ItemIdSelector = x => x.PostOpDay0_1,
                    ItemKeySelector = x => x.PostOpDay0_1,
                    DisplayOrder = 12
                }
            };

            var MultiSelectedFilterRequests = new List<FilterRequest<SurgicalIntervention>>
            {
                new()
                {
                    CategoryDisplayName = "Category",
                    CategoryName = "Category",
                    FilterType = "Checkbox",
                    Source = Categories,
                    ItemIdSelector = x => x.Category,
                    ItemKeySelector = x => x.Category,
                    DisplayOrder = 8
                },
                new()
                {
                    CategoryDisplayName = "Approach",
                    CategoryName = "Approach",
                    FilterType = "Checkbox",
                    Source = Approaches,
                    ItemIdSelector = x => x.Approach,
                    ItemKeySelector = x => x.Approach,
                    DisplayOrder = 9
                },
                new()
                {
                    CategoryDisplayName = "Organ",
                    CategoryName = "Organ",
                    FilterType = "Checkbox",
                    Source = Organs,
                    ItemIdSelector = x => x.Organ,
                    ItemKeySelector = x => x.Organ,
                    DisplayOrder = 10
                }
            };

            var FilterRequestsDoctors = new List<FilterRequest<Doctor>>
            {
                new()
                {
                    CategoryDisplayName = "Main surgeon",
                    CategoryName = "Main surgeon",
                    FilterType = "Checkbox",
                    Source = MainsurgeonDoctor,
                    ItemIdSelector = x => x.DoctorId.ToString(),
                    ItemKeySelector = x => x.DoctorName,
                    DisplayOrder = 4
                },
                new()
                {
                    CategoryDisplayName = "Assistants",
                    CategoryName = "Assistants",
                    FilterType = "Checkbox",
                    Source = AssistantsDoctor,
                    ItemIdSelector = x => x.DoctorId.ToString(),
                    ItemKeySelector = x => x.DoctorName,
                    DisplayOrder = 5
                },
                new()
                {
                    CategoryDisplayName = "Resident",
                    CategoryName = "Resident",
                    FilterType = "Checkbox",
                    Source = ResidentsDoctor,
                    ItemIdSelector = x => x.DoctorId.ToString(),
                    ItemKeySelector = x => x.DoctorName,
                    DisplayOrder = 6
                }
            };

            var DoctorFilters = await FilterRequestsDoctors.GenerateManyAsync();
            if (DoctorFilters != null && DoctorFilters.Count > 0)
                FinalFilters.AddRange(DoctorFilters);
            var MultiSelectFilters = await MultiSelectedFilterRequests.GenerateManyAsync();
            if (MultiSelectFilters != null && MultiSelectFilters.Count > 0)
                FinalFilters.AddRange(MultiSelectFilters);
            var OtherFilters = await OtherFilterRequests.GenerateManyAsync();
            if (OtherFilters != null && OtherFilters.Count > 0)
                FinalFilters.AddRange(OtherFilters);
            return ApiResponseModel<List<FilterModel>>.Success(GenericErrors.GetSuccess, FinalFilters.OrderBy(i => i.DisplayOrder).ToList());
        }
        public async Task<ApiResponseModel<SurgicalIntervention>> GetSurgicalInterventionById(int SurgicalInterventionId)
        {
            var surgicalIntervention = await _unitOfWork.Repository<SurgicalIntervention>().GetByIdAsync(SurgicalInterventionId);

            if (surgicalIntervention == null)
            {
                return ApiResponseModel<SurgicalIntervention>
                    .Failure(GenericErrors.NotFound);
            }

            // Collect all doctor IDs from the comma-separated strings
            var allDoctorIds = new List<int>();

            if (!string.IsNullOrEmpty(surgicalIntervention.MainSurgeon))
                allDoctorIds.AddRange(surgicalIntervention.MainSurgeon.Split(',').Select(id => int.Parse(id.Trim())));

            if (!string.IsNullOrEmpty(surgicalIntervention.Assistants))
                allDoctorIds.AddRange(surgicalIntervention.Assistants.Split(',').Select(id => int.Parse(id.Trim())));

            if (!string.IsNullOrEmpty(surgicalIntervention.Resident))
                allDoctorIds.AddRange(surgicalIntervention.Resident.Split(',').Select(id => int.Parse(id.Trim())));

            if (!string.IsNullOrEmpty(surgicalIntervention.OffFieldSupervisor))
                allDoctorIds.AddRange(surgicalIntervention.OffFieldSupervisor.Split(',').Select(id => int.Parse(id.Trim())));

            // Remove duplicates
            allDoctorIds = allDoctorIds.Distinct().ToList();

            if (allDoctorIds.Any())
            {
                // Fetch all doctors in one query
                var doctors = await _unitOfWork.Repository<Doctor>()
                    .WhereAsync(d => allDoctorIds.Contains(d.DoctorId) && !d.IsDeleted);

                // Create a dictionary for quick lookup
                var doctorDictionary = doctors.ToDictionary(d => d.DoctorId, d => d);

                // Helper method to get doctor details
                List<DoctorDetailsDto> GetDoctorDetails(string? doctorIds)
                {
                    if (string.IsNullOrEmpty(doctorIds))
                        return new List<DoctorDetailsDto>();

                    return doctorIds.Split(',')
                        .Select(id => int.Parse(id.Trim()))
                        .Where(id => doctorDictionary.ContainsKey(id))
                        .Select(id => new DoctorDetailsDto
                        {
                            DoctorId = doctorDictionary[id].DoctorId,
                            DoctorName = doctorDictionary[id].DoctorName,
                            AcademicDegree = doctorDictionary[id].AcademicDegree
                        })
                        .ToList();
                }

                // Populate doctor details for each role in the SurgicalIntervention object
                surgicalIntervention.MainSurgeonDetails = GetDoctorDetails(surgicalIntervention.MainSurgeon);
                surgicalIntervention.AssistantsDetails = GetDoctorDetails(surgicalIntervention.Assistants);
                surgicalIntervention.ResidentDetails = GetDoctorDetails(surgicalIntervention.Resident);
                surgicalIntervention.OffFieldSupervisorDetails = GetDoctorDetails(surgicalIntervention.OffFieldSupervisor);
            }

            return ApiResponseModel<SurgicalIntervention>
                .Success(GenericErrors.GetSuccess, surgicalIntervention);
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
                    IsDeleted = false,
                    InsertUser = Model.InsertUser,
                    InsertDate = DateTime.UtcNow
                };

                await _unitOfWork.Repository<SurgicalIntervention>().AddAsync(surgicalIntervention);
                await _unitOfWork.CompleteAsync();

                if (!string.IsNullOrEmpty(Model.DoctorId))
                {
                    var SurgicalDoctors = new List<SurgicalDoctor>();
                    var DoctorIds = Model.DoctorId.Split(',');
                    foreach (var doctorId in DoctorIds)
                    {
                        var surgicalDoctor = new SurgicalDoctor
                        {
                            SurgicalInterventionId = surgicalIntervention.SurgicalInterventionId,
                            DoctorId = int.Parse(doctorId),
                        };

                        SurgicalDoctors.Add(surgicalDoctor);
                    }

                    await _unitOfWork.Repository<SurgicalDoctor>().AddRangeAsync(SurgicalDoctors);
                    await _unitOfWork.CompleteAsync();
                }

                if (Model.FileModel != null)
                {
                    Model.FileModel.InsertUser = Model.InsertUser;
                    Model.FileModel.ActionId = surgicalIntervention.SurgicalInterventionId;
                    Model.FileModel.ActionType = ActionTypes.SurgicalIntervention;
                    var Attachments = await _attachmentsService.AddActionFiles(Model.FileModel);
                }

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
                Entity.UpdateUser = Model.InsertUser;
                Entity.UpdateDate = DateTime.UtcNow;

                if (!string.IsNullOrEmpty(Model.DoctorId))
                {
                    await _unitOfWork.Repository<SurgicalDoctor>().DeleteWhereAsync(i => i.SurgicalInterventionId == Entity.SurgicalInterventionId);

                    var SurgicalDoctors = new List<SurgicalDoctor>();
                    var DoctorIds = Model.DoctorId.Split(',');
                    foreach (var doctorId in DoctorIds)
                    {
                        var surgicalDoctor = new SurgicalDoctor
                        {
                            SurgicalInterventionId = Entity.SurgicalInterventionId,
                            DoctorId = int.Parse(doctorId),
                        };

                        SurgicalDoctors.Add(surgicalDoctor);
                    }

                    await _unitOfWork.Repository<SurgicalDoctor>().AddRangeAsync(SurgicalDoctors);
                }


                await _unitOfWork.CompleteAsync();

                if (Model.FileModel != null)
                {
                    Model.FileModel.InsertUser = "997d4e26-da04-4dd6-819b-bb745219694b";
                    Model.FileModel.ActionId = Entity.SurgicalInterventionId;
                    Model.FileModel.ActionType = ActionTypes.SurgicalIntervention;
                    var Attachments = await _attachmentsService.AddActionFiles(Model.FileModel);
                }

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
                await _unitOfWork.Repository<SurgicalDoctor>().DeleteWhereAsync(i => i.SurgicalInterventionId == Entity.SurgicalInterventionId);
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
