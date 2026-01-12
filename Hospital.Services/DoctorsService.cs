using Hospital.Entities.Common;
using Hospital.Entities.Models;
using Hospital.Entities.Specifications.Doctors;
using Hospital.Interfaces;
using Hospital.Interfaces.Repositories;
using Hospital.Reports.Interface;
using Hospital.Services.Common;

namespace Hospital.Services
{
    public class DoctorsService : IDoctorsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IExportManagerService _exportManagerService;
        public DoctorsService(IUnitOfWork unitOfWork, IExportManagerService exportManagerService)
        {
            _unitOfWork = unitOfWork;
            _exportManagerService = exportManagerService;
        }

        public async Task<ApiResponseModel<List<Doctor>>> GetAllDoctorData(PagingFilterModel PagingFilter)
        {
            var DataSpec = new DoctorDataSpecification(PagingFilter);
            var CountSpec = new DoctorDataSpecification(PagingFilter, false);
            var Entity = _unitOfWork.Repository<Doctor>();
            var TotalCount = await Entity.GetCountAsync(CountSpec);
            var Results = await Entity.GetAllWithSpecAsync(DataSpec);
            var Data = Results.Select(i => new Doctor
            {
                DoctorId = i.DoctorId,
                DoctorName = i.DoctorName,
                AcademicDegree = i.AcademicDegree
            }).ToList();

            return ApiResponseModel<List<Doctor>>.Success(GenericErrors.GetSuccess, Data, TotalCount);
        }

        public async Task<ApiResponseModel<string>> AddNewDoctor(Doctor Model)
        {
            try
            {
                var followUp = new Doctor
                {
                    DoctorName = Model.DoctorName,
                    AcademicDegree = Model.AcademicDegree,
                    IsDeleted = false,
                    InsertUser = Model.InsertUser,
                    InsertDate = DateTime.UtcNow
                };

                await _unitOfWork.Repository<Doctor>().AddAsync(followUp);
                await _unitOfWork.CompleteAsync();

                return ApiResponseModel<string>.Success(GenericErrors.AddSuccess);
            }
            catch (Exception)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        public async Task<ApiResponseModel<string>> UpdateDoctor(Doctor Model)
        {
            try
            {
                var Entity = await _unitOfWork.Repository<Doctor>().GetByIdAsync(Model.DoctorId);

                if (Entity == null)
                    return ApiResponseModel<string>.Failure(GenericErrors.NotFound);

                Entity.DoctorName = Model.DoctorName;
                Entity.AcademicDegree = Model.AcademicDegree;
                Entity.UpdateUser = Model.InsertUser;
                Entity.UpdateDate = DateTime.UtcNow;

                await _unitOfWork.CompleteAsync();

                return ApiResponseModel<string>.Success(GenericErrors.UpdateSuccess);
            }
            catch (Exception)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        public async Task<ApiResponseModel<string>> DeleteDoctor(int DoctorId)
        {
            try
            {
                var Entity = await _unitOfWork.Repository<Doctor>().GetByIdAsync(DoctorId);
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

        public async Task<bool> GetMainSurgeons(string filePath)
        {
            try
            {
                var doctorList = new List<Doctor>();
                var SheetData = _exportManagerService.GetMainSurgeons(filePath); // Use parameter

                // Get existing doctors from database to avoid duplicates
                var existingDoctors = await _unitOfWork.Repository<Doctor>()
                    .GetAllAsync();
                var existingDoctorNames = existingDoctors
                    .Select(d => d.DoctorName)
                    .ToHashSet();

                foreach (var doctorName in SheetData)
                {
                    // Skip if doctor already exists in database
                    if (existingDoctorNames.Contains(doctorName))
                        continue;

                    var doctor = new Doctor
                    {
                        DoctorName = doctorName,
                        AcademicDegree = null, // Leave as null or set default
                        IsDeleted = false,
                        InsertUser = "b0aaf719-a21c-453c-b67b-8a97c0f2e91d",
                        InsertDate = DateTime.UtcNow
                    };

                    doctorList.Add(doctor);
                }

                if (doctorList.Any())
                {
                    await _unitOfWork.Repository<Doctor>().AddRangeAsync(doctorList);
                    await _unitOfWork.CompleteAsync();
                }

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<bool> GetMainSurgeons2(string filePath)
        {
            try
            {
                var doctorRoles = _exportManagerService.GetDoctorsWithRoles(filePath);

                if (!doctorRoles.Any())
                    return true; // No data is not an error

                var doctorList = new List<Doctor>();

                foreach (var (doctorName, academicDegree) in doctorRoles)
                {
                    doctorList.Add(new Doctor
                    {
                        DoctorName = doctorName,
                        AcademicDegree = academicDegree,
                        IsDeleted = false,
                        InsertUser = "006b7d3a-3088-4677-9f63-845decbb9013",
                        InsertDate = DateTime.UtcNow
                    });
                }

                await _unitOfWork.Repository<Doctor>().AddRangeAsync(doctorList);
                await _unitOfWork.CompleteAsync();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
