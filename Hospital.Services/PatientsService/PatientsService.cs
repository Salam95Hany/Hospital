using Hospital.Entities.Common;
using Hospital.Entities.Models;
using Hospital.Interfaces.IPatients;
using Hospital.Interfaces.Repositories;
using Hospital.Services.Common;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Services.PatientsService
{
    public class PatientsService : IPatientsService
    {
        private readonly IUnitOfWork _unitOfWork;
        public PatientsService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
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

        private async Task<string> GenerateUniqueInternalNumber()
        {
            var currentYear = DateTime.Now.Year;
            var prefix = $"URO-{currentYear}-";

            // Using WhereAsync to get filtered list
            var internalNumbers = await _unitOfWork.Repository<Patient>()
                .WhereAsync(p => p.InternalNumber != null && p.InternalNumber.StartsWith(prefix));

            if (!internalNumbers.Any())
            {
                return $"{prefix}0001";
            }

            var lastInternalNumber = internalNumbers
                .OrderByDescending(p => p.InternalNumber)
                .Select(p => p.InternalNumber)
                .First();

            var lastNumberStr = lastInternalNumber.Substring(prefix.Length);
            if (int.TryParse(lastNumberStr, out int lastNumber))
            {
                var newNumber = lastNumber + 1;
                return $"{prefix}{newNumber:D4}";
            }

            return $"{prefix}{DateTime.Now:MMddHHmmss}";
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
                NationalIdImagePath = patientModel.NationalIdImagePath,
                InsertUser = patientModel.InsertUser,
                InsertDate = DateTime.UtcNow
            };

            await _unitOfWork.Repository<Patient>().AddAsync(patient);
            await _unitOfWork.CompleteAsync(); // Complete to get the PatientId

            return patient.PatientId;
        }

        private async Task<int> AddNewAdmission(Admission admissionModel, int patientId)
        {
            var admission = new Admission
            {
                PatientId = patientId,
                HospitalFileNumber = admissionModel.HospitalFileNumber,
                AdmissionDate = admissionModel.AdmissionDate,
                DischargeDate = admissionModel.DischargeDate,
                ChiefComplaint = admissionModel.ChiefComplaint,
                Duration = admissionModel.Duration,
                Course = admissionModel.Course,
                HPI = admissionModel.HPI,
                Comorbidities = admissionModel.Comorbidities,
                CurrentMedications = admissionModel.CurrentMedications,
                PastHistory = admissionModel.PastHistory,
                FamilyHistory = admissionModel.FamilyHistory,
                BMI = admissionModel.BMI,
                Temperature = admissionModel.Temperature,
                Pulse = admissionModel.Pulse,
                BloodPressure = admissionModel.BloodPressure,
                GeneralExamination = admissionModel.GeneralExamination,
                AbdominalExamination = admissionModel.AbdominalExamination,
                GenitalExamination = admissionModel.GenitalExamination,
                DREVaginalExamination = admissionModel.DREVaginalExamination,
                UrineAnalysis = admissionModel.UrineAnalysis,
                CultureAndSensitivity = admissionModel.CultureAndSensitivity,
                SerumCreatinine = admissionModel.SerumCreatinine,
                Hemoglobin = admissionModel.Hemoglobin,
                TotalLeukocyteCount = admissionModel.TotalLeukocyteCount,
                Platelets = admissionModel.Platelets,
                PT_PTT_INR = admissionModel.PT_PTT_INR,
                LiverEnzymes = admissionModel.LiverEnzymes,
                FastingBloodSugar = admissionModel.FastingBloodSugar,
                PostPrandialBloodSugar = admissionModel.PostPrandialBloodSugar,
                HbA1c = admissionModel.HbA1c,
                PSATotal = admissionModel.PSATotal,
                PSAFree = admissionModel.PSAFree,
                PSARatio = admissionModel.PSARatio,
                OtherLabResults = admissionModel.OtherLabResults,
                PUT = admissionModel.PUT,
                Ultrasound = admissionModel.Ultrasound,
                TRUS = admissionModel.TRUS,
                CT = admissionModel.CT,
                MRI = admissionModel.MRI,
                IsotopeStudies = admissionModel.IsotopeStudies,
                OtherImaging = admissionModel.OtherImaging,
                ProvisionalDiagnosis = admissionModel.ProvisionalDiagnosis,
                MedicalDecision = admissionModel.MedicalDecision,
                ScheduledDate = admissionModel.ScheduledDate,
                InsertUser = admissionModel.InsertUser,
                InsertDate = DateTime.UtcNow
            };

            await _unitOfWork.Repository<Admission>().AddAsync(admission);
            await _unitOfWork.CompleteAsync(); // Complete to get the AdmissionId

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
                InsertDate = DateTime.UtcNow
            };

            await _unitOfWork.Repository<SurgicalIntervention>().AddAsync(surgicalIntervention);
            await _unitOfWork.CompleteAsync(); // Complete to get the SurgicalInterventionId

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
                InsertDate = DateTime.UtcNow
            };

            await _unitOfWork.Repository<FollowUp>().AddAsync(followUp);
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
        public async Task<ApiResponseModel<List<PatientListDto>>> GetAllPatientsBasicInfoAsync(CancellationToken cancellationToken = default)
        {
         
                var patients = await _unitOfWork.Repository<Patient>()
                    .GetAllAsQueryable().Where(i=>i.IsDeleted != true)
                    .Select(p => new PatientListDto
                    {
                        Id = p.PatientId,
                        InternalNumber = p.InternalNumber,
                        Name = p.Name,
                        Age = p.Age,
                        Governorate = p.Governorate,
                        Gender = p.Gender
                    })
                    .ToListAsync(cancellationToken);

                return ApiResponseModel<List<PatientListDto>>.Success(GenericErrors.GetSuccess, patients);
            
   
        }
        public async Task<ApiResponseModel<string>> UpdatePatientFull(AddPatientFullModel Model, CancellationToken cancellationToken = default)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync(cancellationToken);
            try
            {
                // Step 1: Update Patient
                await UpdatePatient(Model.Patient);

                // Step 2: Update or Create Admission
                if (Model.Admission != null)
                {
                    if (Model.Admission.AdmissionId > 0)
                    {
                        await UpdateAdmission(Model.Admission);
                    }
                    else
                    {
                        await AddNewAdmission(Model.Admission, Model.Patient.PatientId);
                    }
                }

                // Step 3: Update or Create Surgical Intervention
                if (Model.SurgicalIntervention != null)
                {
                    if (Model.SurgicalIntervention.SurgicalInterventionId > 0)
                    {
                        await UpdateSurgicalIntervention(Model.SurgicalIntervention);
                    }
                    else if (Model.Admission?.AdmissionId > 0)
                    {
                        await AddNewSurgicalIntervention(Model.SurgicalIntervention, Model.Admission.AdmissionId);
                    }
                }

                // Step 4: Update or Create FollowUp
                if (Model.FollowUp != null)
                {
                    if (Model.FollowUp.FollowUpId > 0)
                    {
                        await UpdateFollowUp(Model.FollowUp);
                    }
                    else if (Model.SurgicalIntervention?.SurgicalInterventionId > 0)
                    {
                        await AddNewFollowUp(Model.FollowUp, Model.SurgicalIntervention.SurgicalInterventionId);
                    }
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
            existingPatient.NationalIdImagePath = patientModel.NationalIdImagePath;
            existingPatient.UpdateUser = patientModel.UpdateUser;
            existingPatient.UpdateDate = DateTime.UtcNow;

            _unitOfWork.Repository<Patient>().Update(existingPatient);
        }

        private async Task UpdateAdmission(Admission admissionModel)
        {
            var existingAdmission = await _unitOfWork.Repository<Admission>()
                .GetByIdAsync(admissionModel.AdmissionId);

            if (existingAdmission == null)
                throw new ArgumentException("Admission not found");

            // Update admission properties
            existingAdmission.HospitalFileNumber = admissionModel.HospitalFileNumber;
            existingAdmission.AdmissionDate = admissionModel.AdmissionDate;
            existingAdmission.DischargeDate = admissionModel.DischargeDate;
            existingAdmission.ChiefComplaint = admissionModel.ChiefComplaint;
            existingAdmission.Duration = admissionModel.Duration;
            existingAdmission.Course = admissionModel.Course;
            existingAdmission.HPI = admissionModel.HPI;
            existingAdmission.Comorbidities = admissionModel.Comorbidities;
            existingAdmission.CurrentMedications = admissionModel.CurrentMedications;
            existingAdmission.PastHistory = admissionModel.PastHistory;
            existingAdmission.FamilyHistory = admissionModel.FamilyHistory;
            existingAdmission.BMI = admissionModel.BMI;
            existingAdmission.Temperature = admissionModel.Temperature;
            existingAdmission.Pulse = admissionModel.Pulse;
            existingAdmission.BloodPressure = admissionModel.BloodPressure;
            existingAdmission.GeneralExamination = admissionModel.GeneralExamination;
            existingAdmission.AbdominalExamination = admissionModel.AbdominalExamination;
            existingAdmission.GenitalExamination = admissionModel.GenitalExamination;
            existingAdmission.DREVaginalExamination = admissionModel.DREVaginalExamination;
            existingAdmission.UrineAnalysis = admissionModel.UrineAnalysis;
            existingAdmission.CultureAndSensitivity = admissionModel.CultureAndSensitivity;
            existingAdmission.SerumCreatinine = admissionModel.SerumCreatinine;
            existingAdmission.Hemoglobin = admissionModel.Hemoglobin;
            existingAdmission.TotalLeukocyteCount = admissionModel.TotalLeukocyteCount;
            existingAdmission.Platelets = admissionModel.Platelets;
            existingAdmission.PT_PTT_INR = admissionModel.PT_PTT_INR;
            existingAdmission.LiverEnzymes = admissionModel.LiverEnzymes;
            existingAdmission.FastingBloodSugar = admissionModel.FastingBloodSugar;
            existingAdmission.PostPrandialBloodSugar = admissionModel.PostPrandialBloodSugar;
            existingAdmission.HbA1c = admissionModel.HbA1c;
            existingAdmission.PSATotal = admissionModel.PSATotal;
            existingAdmission.PSAFree = admissionModel.PSAFree;
            existingAdmission.PSARatio = admissionModel.PSARatio;
            existingAdmission.OtherLabResults = admissionModel.OtherLabResults;
            existingAdmission.PUT = admissionModel.PUT;
            existingAdmission.Ultrasound = admissionModel.Ultrasound;
            existingAdmission.TRUS = admissionModel.TRUS;
            existingAdmission.CT = admissionModel.CT;
            existingAdmission.MRI = admissionModel.MRI;
            existingAdmission.IsotopeStudies = admissionModel.IsotopeStudies;
            existingAdmission.OtherImaging = admissionModel.OtherImaging;
            existingAdmission.ProvisionalDiagnosis = admissionModel.ProvisionalDiagnosis;
            existingAdmission.MedicalDecision = admissionModel.MedicalDecision;
            existingAdmission.ScheduledDate = admissionModel.ScheduledDate;
            existingAdmission.UpdateUser = admissionModel.UpdateUser;
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

                return ApiResponseModel<string>.Success(GenericErrors.AddSuccess);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
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
                var patient = await _unitOfWork.Repository<Patient>()
                    .GetAllAsQueryable()
                    .Include(p => p.Admissions)
                            .ThenInclude(a => a.SurgicalInterventions)
                                .ThenInclude(si => si.FollowUps)
                    .FirstOrDefaultAsync(p => p.PatientId == patientId, cancellationToken);

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

                return ApiResponseModel<PatientFullDetailsDto>.Success(GenericErrors.AlreadyExists,result);
            }
            catch (Exception ex)
            {
                return ApiResponseModel<PatientFullDetailsDto>.Failure(GenericErrors.NotFound);
            }
        }
    }
}
