using Hospital.Entities.Auth;
using Hospital.Entities.Common;
using Hospital.Entities.Contracts.DTOs;
using Hospital.Entities.Contracts.Requests;
using Hospital.Entities.Models;
using Hospital.Entities.Specifications.Patients;
using Hospital.Entities.Specifications.SearchAutoComplete;
using Hospital.Interfaces;
using Hospital.Interfaces.IPatients;
using Hospital.Interfaces.Repositories;
using Hospital.Services.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Services.PatientsService
{
    public class PatientsService : IPatientsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAttachmentsService _attachmentsService;
        public PatientsService(IUnitOfWork unitOfWork, IAttachmentsService attachmentsService)
        {
            _unitOfWork = unitOfWork;
            _attachmentsService = attachmentsService;
        }
        public async Task<ApiResponseModel<string>> AddNewPatientFull(AddPatientFullModel Model, CancellationToken cancellationToken = default)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync(cancellationToken);
            try
            {
                // Step 1: Generate unique internal number and save Patient
                var internalNumber = await GenerateUniqueInternalNumber();
                var patientId = await AddNewPatient(Model.Patient, internalNumber);

                // Step 2: Save Admission with PatientId
                int? admissionId = null;
                if (Model.Admission != null)
                {
                    admissionId = await AddNewAdmission(Model.Admission, patientId);
                }

                // Step 3: Save Surgical Intervention with AdmissionId (if admission exists)
                int? surgicalInterventionId = null;
                if (Model.SurgicalIntervention != null && admissionId.HasValue)
                {
                    surgicalInterventionId = await AddNewSurgicalIntervention(Model.SurgicalIntervention, admissionId.Value);
                }

                // Step 4: Save FollowUp with SurgicalInterventionId (if surgical intervention exists)
                if (Model.FollowUp != null && surgicalInterventionId.HasValue)
                {
                    await AddNewFollowUp(Model.FollowUp, surgicalInterventionId.Value);
                }


                await transaction.CommitAsync(cancellationToken);

                return ApiResponseModel<string>.Success(GenericErrors.AddSuccess);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        private async Task<string> GenerateUniqueInternalNumber()
        {
            var currentYear = DateTime.Now.Year;
            var random = new Random();
            var randomPart = random.Next(1000, 9999).ToString(); // 4-digit random number
            var prefix = $"URO-{currentYear}-{randomPart}-";

            // Get all existing internal numbers for the current year
            var yearPrefix = $"URO-{currentYear}-";
            var internalNumbers = await _unitOfWork.Repository<Patient>()
                .WhereAsync(p => p.InternalNumber != null && p.InternalNumber.StartsWith(yearPrefix));

            // Find the highest sequential number across ALL existing numbers
            int newSequentialNumber = 1;
            if (internalNumbers.Any())
            {
                var lastSequentialNumber = internalNumbers
                    .Select(p =>
                    {
                        var parts = p.InternalNumber.Split('-');
                        if (parts.Length >= 4 && int.TryParse(parts[3], out int seq))
                            return seq;
                        return 0;
                    })
                    .Max();

                newSequentialNumber = lastSequentialNumber + 1;
            }

            return $"{prefix}{newSequentialNumber:D4}";
        }
        private async Task<int> AddNewPatient(Patient patientModel, string internalNumber)
        {
            var patient = new Patient
            {
                Name = patientModel.Name,
                BirthDate = patientModel.BirthDate,
                Age = patientModel.Age,
                Gender = patientModel.Gender,
                NationalId = patientModel.NationalId,
                Address = patientModel.Address,
                Governorate = patientModel.Governorate,
                Occupation = patientModel.Occupation,
                MaritalStatus = patientModel.MaritalStatus,
                ChildrenCount = patientModel.ChildrenCount,
                InternalNumber = internalNumber,
                InsertUser = patientModel.InsertUser,
                InsertDate = DateTime.UtcNow,
                IsDeleted = false
            };
            await _unitOfWork.Repository<Patient>().AddAsync(patient);
            await _unitOfWork.CompleteAsync();
            if (patientModel.FileModel != null)
            {
                patientModel.FileModel.InsertUser = "997d4e26-da04-4dd6-819b-bb745219694b";
                patientModel.FileModel.ActionId = patient.PatientId;
                patientModel.FileModel.ActionType = ActionTypes.Patient;
                var Attachments = await _attachmentsService.AddActionFiles(patientModel.FileModel);
            }

            // Complete to get the PatientId

            return patient.PatientId;
        }

        private async Task<int> AddNewAdmission(Admission Model, int patientId)
        {
            var admission = new Admission
            {
                PatientId = patientId,
                HospitalFileNumber = Model.HospitalFileNumber,
                AdmissionDate = Model.AdmissionDate,
                DischargeDate = Model.DischargeDate,
                ChiefComplaint = Model.ChiefComplaint,
                Duration = Model.Duration,
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
                InsertUser = Model.InsertUser,
                InsertDate = DateTime.UtcNow,
                IsDeleted = false
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

            return admission.AdmissionId;
        }

        private async Task<int> AddNewSurgicalIntervention(SurgicalIntervention interventionModel, int admissionId)
        {
            var surgicalIntervention = new SurgicalIntervention
            {
                AdmissionId = admissionId,
                InterventionDate = interventionModel.InterventionDate,
                Theater = interventionModel.Theater,
                MainSurgeon = interventionModel.MainSurgeon,
                Assistants = interventionModel.Assistants,
                Resident = interventionModel.Resident,
                OtherSurgeons = interventionModel.OtherSurgeons,
                OffFieldSupervisor = interventionModel.OffFieldSupervisor,
                Anesthesia = interventionModel.Anesthesia,
                Intervention = interventionModel.Intervention,
                InterventionDetails = interventionModel.InterventionDetails,
                TubesFixed = interventionModel.TubesFixed,
                Category = interventionModel.Category,
                Approach = interventionModel.Approach,
                Organ = interventionModel.Organ,
                IntraOperativeCourse = interventionModel.IntraOperativeCourse,
                IntraOpAdverseEvents = interventionModel.IntraOpAdverseEvents,
                BloodTransfusionUnits = interventionModel.BloodTransfusionUnits,
                PostOpRecommendations = interventionModel.PostOpRecommendations,
                PostOpDay0_1 = interventionModel.PostOpDay0_1,
                PostOpDay2_5 = interventionModel.PostOpDay2_5,
                PostOpDayOver5 = interventionModel.PostOpDayOver5,
                PostOpAdverseEvents = interventionModel.PostOpAdverseEvents,
                DischargeDate = interventionModel.DischargeDate,
                FinalDiagnosis = interventionModel.FinalDiagnosis,
                DischargeInstructions = interventionModel.DischargeInstructions,
                FollowUpDoctor = interventionModel.FollowUpDoctor,
                FollowUpDoctorPhone = interventionModel.FollowUpDoctorPhone,
                FollowUpAppointment = interventionModel.FollowUpAppointment,
                InsertUser = interventionModel.InsertUser,
                InsertDate = DateTime.UtcNow,
                IsDeleted = false
            };

            await _unitOfWork.Repository<SurgicalIntervention>().AddAsync(surgicalIntervention);
            await _unitOfWork.CompleteAsync();

            if (interventionModel.FileModel != null)
            {
                interventionModel.FileModel.InsertUser = "997d4e26-da04-4dd6-819b-bb745219694b";
                interventionModel.FileModel.ActionId = surgicalIntervention.SurgicalInterventionId;
                interventionModel.FileModel.ActionType = ActionTypes.SurgicalIntervention;
                var Attachments = await _attachmentsService.AddActionFiles(interventionModel.FileModel);
            }

            return surgicalIntervention.SurgicalInterventionId;
        }

        private async Task AddNewFollowUp(FollowUp followUpModel, int surgicalInterventionId)
        {
            var followUp = new FollowUp
            {
                SurgicalInterventionId = surgicalInterventionId,
                FollowUpDate = followUpModel.FollowUpDate,
                PatientRemarksStatus = followUpModel.PatientRemarksStatus,
                PatientRemarksDetails = followUpModel.PatientRemarksDetails,
                ExaminationFindings = followUpModel.ExaminationFindings,
                WoundStatus = followUpModel.WoundStatus,
                Catheters = followUpModel.Catheters,
                LabResults = followUpModel.LabResults,
                ImagingResults = followUpModel.ImagingResults,
                ImagePath = followUpModel.ImagePath,
                Advice = followUpModel.Advice,
                NewDecision = followUpModel.NewDecision,
                NextFollowUpDate = followUpModel.NextFollowUpDate,
                InsertUser = followUpModel.InsertUser,
                InsertDate = DateTime.UtcNow,
                IsDeleted = false
            };

            await _unitOfWork.Repository<FollowUp>().AddAsync(followUp);
            await _unitOfWork.CompleteAsync();

            if (followUpModel.FileModel != null)
            {
                followUpModel.FileModel.InsertUser = "997d4e26-da04-4dd6-819b-bb745219694b";
                followUpModel.FileModel.ActionId = followUp.FollowUpId;
                followUpModel.FileModel.ActionType = ActionTypes.FollowUp;
                var Attachments = await _attachmentsService.AddActionFiles(followUpModel.FileModel);
            }
        }
        public async Task<bool> IsNationalIdExists(string nationalId)
        {
            return await _unitOfWork.Repository<Patient>()
                .AnyAsync(p => p.NationalId == nationalId);
        }

        // Method to get patient by internal number
        public async Task<Patient> GetPatientByInternalNumber(string internalNumber)
        {
            return await _unitOfWork.Repository<Patient>()
                .FirstOrDefaultAsync(p => p.InternalNumber == internalNumber);
        }
        public async Task<ApiResponseModel<List<PatientListDto>>> GetAllPatientsBasicInfoAsync(PagingFilterModel PagingFilter, CancellationToken cancellationToken = default)
        {
            var DataSpec = new PatientDataSpecification(PagingFilter);
            var CountSpec = new PatientDataSpecification(PagingFilter, false);
            var Entity = _unitOfWork.Repository<Patient>();
            var TotalCount = await Entity.GetCountAsync(CountSpec, cancellationToken);
            var Data = await Entity.GetAllWithSpecAsync(DataSpec, cancellationToken);
            var Results = Data.Select(p => new PatientListDto
            {
                Id = p.PatientId,
                InternalNumber = p.InternalNumber,
                Name = p.Name,
                Age = p.Age,
                Governorate = p.Governorate,
                Gender = p.Gender
            }).ToList();

            return ApiResponseModel<List<PatientListDto>>.Success(GenericErrors.GetSuccess, Results, TotalCount);


        }
        //public async Task<ApiResponseModel<List<FilterModel>>> GetAllPatientsBasicInfoFilter(CancellationToken cancellationToken = default)
        //{
        //    var data = await _unitOfWork.Repository<Patient>().GetAllAsQueryable().Include(x => x.CreatedBy).Select(x => new Patient
        //    {
        //        InsertUser = x.InsertUser,
        //        CreatedBy = new AdminUser { UserName = x.CreatedBy.UserName }
        //    }).ToListAsync();

        //    var filterRequests = new List<FilterRequest<Patient>>
        //    {
        //        new()
        //        {
        //            CategoryName = "Patient Code",
        //            Source = data,
        //            ItemIdSelector = x => x.InternalNumber,
        //            ItemKeySelector = x => x.InternalNumber ?? ""
        //        }
        //    };

        //    var results = await filterRequests.GenerateManyAsync(cancellationToken);
        //    return ApiResponseModel<List<FilterModel>>.Success(GenericErrors.GetSuccess, results);
        //}
        public async Task<ApiResponseModel<string>> UpdatePatientFull(Patient Model, CancellationToken cancellationToken = default)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync(cancellationToken);
            try
            {

                // Step 1: Update Patient
                await UpdatePatient(Model);

                // Step 2: Update or Create Admission


                await _unitOfWork.CompleteAsync();
                if (Model.FileModel != null)
                {
                    Model.FileModel.InsertUser = "997d4e26-da04-4dd6-819b-bb745219694b";
                    Model.FileModel.ActionId = Model.PatientId;
                    Model.FileModel.ActionType = ActionTypes.Patient;
                    var Attachments = await _attachmentsService.AddActionFiles(Model.FileModel);
                }
                await transaction.CommitAsync(cancellationToken);

                return ApiResponseModel<string>.Success(GenericErrors.AddSuccess);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }
        private async Task UpdatePatient(Patient patientModel)
        {
            var existingPatient = await _unitOfWork.Repository<Patient>()
                .GetByIdAsync(patientModel.PatientId);

            if (existingPatient == null)
                throw new ArgumentException("Patient not found");

            // Update patient properties
            existingPatient.Name = patientModel.Name;
            existingPatient.BirthDate = patientModel.BirthDate;
            existingPatient.Age = patientModel.Age;
            existingPatient.Gender = patientModel.Gender;
            existingPatient.NationalId = patientModel.NationalId;
            existingPatient.Address = patientModel.Address;
            existingPatient.Governorate = patientModel.Governorate;
            existingPatient.Occupation = patientModel.Occupation;
            existingPatient.MaritalStatus = patientModel.MaritalStatus;
            existingPatient.ChildrenCount = patientModel.ChildrenCount;
            existingPatient.UpdateUser = patientModel.UpdateUser;
            existingPatient.UpdateDate = DateTime.UtcNow;

            _unitOfWork.Repository<Patient>().Update(existingPatient);
        }

        private async Task UpdateAdmission(Admission Model)
        {
            var existingAdmission = await _unitOfWork.Repository<Admission>()
                .GetByIdAsync(Model.AdmissionId);

            if (existingAdmission == null)
                throw new ArgumentException("Admission not found");

            // Update admission properties
            existingAdmission.HospitalFileNumber = Model.HospitalFileNumber;
            existingAdmission.AdmissionDate = Model.AdmissionDate;
            existingAdmission.DischargeDate = Model.DischargeDate;
            existingAdmission.ChiefComplaint = Model.ChiefComplaint;
            existingAdmission.Duration = Model.Duration;
            existingAdmission.Course = Model.Course;
            existingAdmission.HPI = Model.HPI;
            existingAdmission.Comorbidities = Model.Comorbidities;
            existingAdmission.CurrentMedications = Model.CurrentMedications;
            existingAdmission.PastHistory = Model.PastHistory;
            existingAdmission.FamilyHistory = Model.FamilyHistory;
            existingAdmission.BMI = Model.BMI;
            existingAdmission.Temperature = Model.Temperature;
            existingAdmission.Pulse = Model.Pulse;
            existingAdmission.BloodPressure = Model.BloodPressure;
            existingAdmission.GeneralExamination = Model.GeneralExamination;
            existingAdmission.AbdominalExamination = Model.AbdominalExamination;
            existingAdmission.GenitalExamination = Model.GenitalExamination;
            existingAdmission.DREVaginalExamination = Model.DREVaginalExamination;
            existingAdmission.UrineAnalysis = Model.UrineAnalysis;
            existingAdmission.CultureAndSensitivity = Model.CultureAndSensitivity;
            existingAdmission.SerumCreatinine = Model.SerumCreatinine;
            existingAdmission.Hemoglobin = Model.Hemoglobin;
            existingAdmission.TotalLeukocyteCount = Model.TotalLeukocyteCount;
            existingAdmission.Platelets = Model.Platelets;
            existingAdmission.PT_PTT_INR = Model.PT_PTT_INR;
            existingAdmission.LiverEnzymes = Model.LiverEnzymes;
            existingAdmission.FastingBloodSugar = Model.FastingBloodSugar;
            existingAdmission.PostPrandialBloodSugar = Model.PostPrandialBloodSugar;
            existingAdmission.HbA1c = Model.HbA1c;
            existingAdmission.PSATotal = Model.PSATotal;
            existingAdmission.PSAFree = Model.PSAFree;
            existingAdmission.PSARatio = Model.PSARatio;
            existingAdmission.OtherLabResults = Model.OtherLabResults;
            existingAdmission.PUT = Model.PUT;
            existingAdmission.Ultrasound = Model.Ultrasound;
            existingAdmission.TRUS = Model.TRUS;
            existingAdmission.CT = Model.CT;
            existingAdmission.MRI = Model.MRI;
            existingAdmission.IsotopeStudies = Model.IsotopeStudies;
            existingAdmission.OtherImaging = Model.OtherImaging;
            existingAdmission.ProvisionalDiagnosis = Model.ProvisionalDiagnosis;
            existingAdmission.MedicalDecision = Model.MedicalDecision;
            existingAdmission.ScheduledDate = Model.ScheduledDate;
            existingAdmission.UpdateUser = Model.UpdateUser;
            existingAdmission.UpdateDate = DateTime.UtcNow;

            _unitOfWork.Repository<Admission>().Update(existingAdmission);
        }

        private async Task UpdateSurgicalIntervention(SurgicalIntervention interventionModel)
        {
            var existingIntervention = await _unitOfWork.Repository<SurgicalIntervention>()
                .GetByIdAsync(interventionModel.SurgicalInterventionId);

            if (existingIntervention == null)
                throw new ArgumentException("Surgical Intervention not found");

            // Update surgical intervention properties
            existingIntervention.InterventionDate = interventionModel.InterventionDate;
            existingIntervention.Theater = interventionModel.Theater;
            existingIntervention.MainSurgeon = interventionModel.MainSurgeon;
            existingIntervention.Assistants = interventionModel.Assistants;
            existingIntervention.Resident = interventionModel.Resident;
            existingIntervention.OtherSurgeons = interventionModel.OtherSurgeons;
            existingIntervention.OffFieldSupervisor = interventionModel.OffFieldSupervisor;
            existingIntervention.Anesthesia = interventionModel.Anesthesia;
            existingIntervention.Intervention = interventionModel.Intervention;
            existingIntervention.InterventionDetails = interventionModel.InterventionDetails;
            existingIntervention.TubesFixed = interventionModel.TubesFixed;
            existingIntervention.Category = interventionModel.Category;
            existingIntervention.Approach = interventionModel.Approach;
            existingIntervention.Organ = interventionModel.Organ;
            existingIntervention.IntraOperativeCourse = interventionModel.IntraOperativeCourse;
            existingIntervention.IntraOpAdverseEvents = interventionModel.IntraOpAdverseEvents;
            existingIntervention.BloodTransfusionUnits = interventionModel.BloodTransfusionUnits;
            existingIntervention.PostOpRecommendations = interventionModel.PostOpRecommendations;
            existingIntervention.PostOpDay0_1 = interventionModel.PostOpDay0_1;
            existingIntervention.PostOpDay2_5 = interventionModel.PostOpDay2_5;
            existingIntervention.PostOpDayOver5 = interventionModel.PostOpDayOver5;
            existingIntervention.PostOpAdverseEvents = interventionModel.PostOpAdverseEvents;
            existingIntervention.DischargeDate = interventionModel.DischargeDate;
            existingIntervention.FinalDiagnosis = interventionModel.FinalDiagnosis;
            existingIntervention.DischargeInstructions = interventionModel.DischargeInstructions;
            existingIntervention.FollowUpDoctor = interventionModel.FollowUpDoctor;
            existingIntervention.FollowUpDoctorPhone = interventionModel.FollowUpDoctorPhone;
            existingIntervention.FollowUpAppointment = interventionModel.FollowUpAppointment;
            existingIntervention.UpdateUser = interventionModel.UpdateUser;
            existingIntervention.UpdateDate = DateTime.UtcNow;

            _unitOfWork.Repository<SurgicalIntervention>().Update(existingIntervention);
        }

        private async Task UpdateFollowUp(FollowUp followUpModel)
        {
            var existingFollowUp = await _unitOfWork.Repository<FollowUp>()
                .GetByIdAsync(followUpModel.FollowUpId);

            if (existingFollowUp == null)
                throw new ArgumentException("FollowUp not found");

            // Update followup properties
            existingFollowUp.FollowUpDate = followUpModel.FollowUpDate;
            existingFollowUp.PatientRemarksStatus = followUpModel.PatientRemarksStatus;
            existingFollowUp.PatientRemarksDetails = followUpModel.PatientRemarksDetails;
            existingFollowUp.ExaminationFindings = followUpModel.ExaminationFindings;
            existingFollowUp.WoundStatus = followUpModel.WoundStatus;
            existingFollowUp.Catheters = followUpModel.Catheters;
            existingFollowUp.LabResults = followUpModel.LabResults;
            existingFollowUp.ImagingResults = followUpModel.ImagingResults;
            existingFollowUp.ImagePath = followUpModel.ImagePath;
            existingFollowUp.Advice = followUpModel.Advice;
            existingFollowUp.NewDecision = followUpModel.NewDecision;
            existingFollowUp.NextFollowUpDate = followUpModel.NextFollowUpDate;
            existingFollowUp.UpdateUser = followUpModel.UpdateUser;
            existingFollowUp.UpdateDate = DateTime.UtcNow;

            _unitOfWork.Repository<FollowUp>().Update(existingFollowUp);
        }
        public async Task<ApiResponseModel<string>> SoftDeletePatientWithAllData(int patientId, CancellationToken cancellationToken = default)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync(cancellationToken);
            try
            {
                var patient = await _unitOfWork.Repository<Patient>().GetByIdAsync(patientId);
                if (patient != null)
                {
                    patient.IsDeleted = true;
                    _unitOfWork.Repository<Patient>().Update(patient);
                }

                // Soft delete all related data
                var admissions = await _unitOfWork.Repository<Admission>()
                    .WhereAsync(a => a.PatientId == patientId);

                foreach (var admission in admissions)
                {
                    admission.IsDeleted = true;
                    _unitOfWork.Repository<Admission>().Update(admission);

                    var surgicalInterventions = await _unitOfWork.Repository<SurgicalIntervention>()
                        .WhereAsync(si => si.AdmissionId == admission.AdmissionId);

                    foreach (var intervention in surgicalInterventions)
                    {
                        intervention.IsDeleted = true;
                        _unitOfWork.Repository<SurgicalIntervention>().Update(intervention);

                        await _unitOfWork.Repository<FollowUp>()
                            .DeleteWhereAsync(f => f.SurgicalInterventionId == intervention.SurgicalInterventionId);
                    }
                }

                await _unitOfWork.CompleteAsync();
                await transaction.CommitAsync(cancellationToken);

                return ApiResponseModel<string>.Success(GenericErrors.DeleteSuccess);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                return ApiResponseModel<string>.Failure(GenericErrors.DeletePassFailed);
            }
        }
        public async Task<ApiResponseModel<string>> DeletePatientWithAllData(int patientId, CancellationToken cancellationToken = default)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync(cancellationToken);
            try
            {
                // Step 1: Get all admissions for this patient
                var admissions = await _unitOfWork.Repository<Admission>()
                    .WhereAsync(a => a.PatientId == patientId);

                // Step 2: For each admission, get surgical interventions and delete followups first
                foreach (var admission in admissions)
                {
                    var surgicalInterventions = await _unitOfWork.Repository<SurgicalIntervention>()
                        .WhereAsync(si => si.AdmissionId == admission.AdmissionId);

                    // Step 3: Delete all followups for each surgical intervention
                    foreach (var surgicalIntervention in surgicalInterventions)
                    {
                        await _unitOfWork.Repository<FollowUp>()
                            .DeleteWhereAsync(f => f.SurgicalInterventionId == surgicalIntervention.SurgicalInterventionId);
                    }

                    // Step 4: Delete all surgical interventions for the admission
                    await _unitOfWork.Repository<SurgicalIntervention>()
                        .DeleteWhereAsync(si => si.AdmissionId == admission.AdmissionId);
                }

                // Step 5: Delete all admissions for the patient
                await _unitOfWork.Repository<Admission>()
                    .DeleteWhereAsync(a => a.PatientId == patientId);

                // Step 6: Finally delete the patient
                var patient = await _unitOfWork.Repository<Patient>()
                    .GetByIdAsync(patientId);

                if (patient != null)
                {
                    _unitOfWork.Repository<Patient>().Delete(patient);
                }

                await _unitOfWork.CompleteAsync();
                await transaction.CommitAsync(cancellationToken);

                return ApiResponseModel<string>.Success(GenericErrors.AddSuccess);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        public async Task<ApiResponseModel<PatientFullDetailsDto>> GetPatientByIdWithIncludeAsync(int patientId, CancellationToken cancellationToken = default)
        {
            try
            {
                var patient = await _unitOfWork.Repository<Patient>().GetByIdAsync(patientId);

                if (patient == null)
                {
                    return ApiResponseModel<PatientFullDetailsDto>.Failure(GenericErrors.NotFound);
                }

                var result = new PatientFullDetailsDto
                {
                    Patient = patient,
                    Admissions = patient.Admissions.ToList(),
                    SurgicalInterventions = patient.Admissions
                        .SelectMany(a => a.SurgicalInterventions)
                        .ToList(),
                    FollowUps = patient.Admissions
                        .SelectMany(a => a.SurgicalInterventions)
                        .SelectMany(si => si.FollowUps)
                        .ToList()
                };

                return ApiResponseModel<PatientFullDetailsDto>.Success(GenericErrors.AlreadyExists, result);
            }
            catch (Exception ex)
            {
                return ApiResponseModel<PatientFullDetailsDto>.Failure(GenericErrors.NotFound);
            }
        }

        public async Task<ApiResponseModel<List<SearchAutoCompleteDto>>> GetSearchAutoCompleteData(SearchAutoCompleteRequest Model)
        {
            if (Model.SearchType == "Patient")
            {
                var Results = await _unitOfWork.Repository<Patient>().WhereAsync(i => i.Name.Contains(Model.SearchText) && i.IsDeleted == false, 10);
                var Data = Results.Select(i => new SearchAutoCompleteDto
                {
                    Id = i.PatientId,
                    Name = i.Name
                }).ToList();

                return ApiResponseModel<List<SearchAutoCompleteDto>>.Success(GenericErrors.GetSuccess, Data);
            }
            else
            {
                string[] formats = { "dd/MM/yyyy", "MM/yyyy", "yyyy-MM", "yyyy/MM", "yyyy-MM-dd" };
                DateTime Date;

                if (!DateTime.TryParseExact(Model.SearchText, formats, CultureInfo.InvariantCulture,
                    DateTimeStyles.None, out Date))
                {
                    return ApiResponseModel<List<SearchAutoCompleteDto>>.Failure(GenericErrors.TransFailed);
                }

                if (Model.SearchType == "Admission")
                {
                    var Results = await _unitOfWork.Repository<Admission>()
                        .WhereAsync(i => i.PatientId == Model.PatientId &&
                                         i.AdmissionDate.HasValue &&
                                         i.AdmissionDate.Value.Month == Date.Month &&
                                         i.AdmissionDate.Value.Year == Date.Year &&
                                         i.IsDeleted == false, 31);

                    var Data = Results.Select(i => new SearchAutoCompleteDto
                    {
                        Id = i.AdmissionId,
                        Name = i.AdmissionDate.Value.ToString("dd/MM/yyyy") + $" ({i.HospitalFileNumber})"
                    }).ToList();

                    return ApiResponseModel<List<SearchAutoCompleteDto>>.Success(GenericErrors.GetSuccess, Data);
                }
                else
                {
                    var Results = await _unitOfWork.Repository<SurgicalIntervention>()
                        .WhereAsync(i => i.AdmissionId == Model.AdmissionId &&
                                         i.InterventionDate.HasValue &&
                                         i.InterventionDate.Value.Month == Date.Month &&
                                         i.InterventionDate.Value.Year == Date.Year &&
                                         i.IsDeleted == false, 31);

                    var Data = Results.Select(i => new SearchAutoCompleteDto
                    {
                        Id = i.SurgicalInterventionId,
                        Name = i.InterventionDate.Value.ToString("dd/MM/yyyy") + $" ({i.Theater})"
                    }).ToList();

                    return ApiResponseModel<List<SearchAutoCompleteDto>>.Success(GenericErrors.GetSuccess, Data);
                }
            }
        }

        public async Task<ApiResponseModel<List<Attachment>>> GetFilesByActionId(int ActionId, ActionTypes ActionType)
        {
            var Results = await _attachmentsService.GetFilesByActionId(ActionId, ActionType);
            return Results;
        }

        public async Task<ApiResponseModel<DashboardCardDto>> GetDashboardStatistics()
        {
            var Card = new DashboardCardDto();
            Card.Patients = await _unitOfWork.Repository<Patient>().CountAsync(i => i.IsDeleted == false);
            Card.Admissions = await _unitOfWork.Repository<Admission>().CountAsync(i => i.IsDeleted == false);
            Card.SurgicalInterventions = await _unitOfWork.Repository<SurgicalIntervention>().CountAsync(i => i.IsDeleted == false);
            Card.FollowUps = await _unitOfWork.Repository<FollowUp>().CountAsync(i => i.IsDeleted == false);
            Card.Doctors = await _unitOfWork.Repository<AdminUser>().CountAsync();
            return ApiResponseModel<DashboardCardDto>.Success(GenericErrors.GetSuccess, Card);
        }

        public async Task<List<Admission>> GetHospitalFileNumber(string hospitalFileNumber)
        {
            var result = await _unitOfWork.Repository<Admission>().WhereAsync(i=>i.HospitalFileNumber == hospitalFileNumber);
            return result;
                
        }

    }
}
