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
                var SheetData = _exportManagerService.GetMainSurgeons(@"C:\Users\salam.hany.CAIRODC\Downloads\Users.xlsx");
                foreach (var doctor in SheetData)
                {
                    var followUp = new Doctor
                    {
                        DoctorName = doctor,
                        AcademicDegree = null,
                        IsDeleted = false,
                        InsertUser = "b0aaf719-a21c-453c-b67b-8a97c0f2e91d",
                        InsertDate = DateTime.UtcNow
                    };

                    doctorList.Add(followUp);
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
