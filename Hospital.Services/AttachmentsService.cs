using Hospital.Entities.Common;
using Hospital.Entities.Models;
using Hospital.Entities.Specifications.Attachments;
using Hospital.Interfaces;
using Hospital.Interfaces.Common;
using Hospital.Interfaces.Repositories;
using Hospital.Services.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Hospital.Services
{
    public class AttachmentsService : IAttachmentsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IManageFileService _manageFileService;
        private readonly IAppSettings _appSettings;
        private readonly string _webRootPath;
        private string ApiLocalUrl;
        public AttachmentsService(IUnitOfWork unitOfWork, IManageFileService manageFileService, IAppSettings appSettings, IOptions<AppPaths> options)
        {
            _unitOfWork = unitOfWork;
            _manageFileService = manageFileService;
            _webRootPath = options.Value.WebRootPath;
            ApiLocalUrl = appSettings.ApiUrlLocal;
        }

        public async Task<ApiResponseModel<List<Attachment>>> GetFilesByActionId(int ActionId, ActionTypes ActionType)
        {
            var Spec = new AttachmentByActionIdSpecification(ActionId, (int)ActionType);
            var Data = await _unitOfWork.Repository<Attachment>().GetAllWithSpecAsync(Spec);
            var Results = Data.Select(i => new Attachment
            {
                AttachmentId = i.AttachmentId,
                ActionId = i.ActionId,
                ActionTypeId = i.ActionTypeId,
                ExistFileName = i.ExistFileName,
                FileName = i.FileName,
                FileUrl = Path.Combine(ApiLocalUrl, ActionType.ToString(), i.FileName),
                FileSize = i.FileSize
            }).ToList();

            return ApiResponseModel<List<Attachment>>.Success(GenericErrors.GetSuccess, Results);
        }

        public async Task<ApiResponseModel<string>> AddActionFiles(UploadFileModel Model)
        {
            try
            {
                if (Model.Files != null)
                {
                    var AttachmentFiles = new List<Attachment>();
                    foreach (var newFile in Model.Files.Where(i => i.File != null))
                    {
                        var FileName = await _manageFileService.UploadFile(newFile.File, Model.ActionType.ToString());
                        if (FileName.IsSuccess)
                        {
                            var AttachmentObj = new Attachment
                            {
                                ActionId = Model.ActionId.Value,
                                ActionTypeId = (int)Model.ActionType,
                                FileName = FileName.Results,
                                ExistFileName = newFile.ExistFileName,
                                FileSize = newFile.FileSize,
                                InsertUser = Model.InsertUser,
                                InsertDate = DateTime.UtcNow
                            };

                            AttachmentFiles.Add(AttachmentObj);
                        }
                        else
                            return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
                    }

                    await _unitOfWork.Repository<Attachment>().AddRangeAsync(AttachmentFiles);
                }

                if (Model.DeletedFiles != null)
                {
                    var AttachmentIds = new List<int>();
                    foreach (var file in Model.DeletedFiles)
                    {
                        var FileName = _manageFileService.DeleteFile(file.FileName, Model.ActionType.ToString());
                        if (FileName.IsSuccess)
                            AttachmentIds.Add(file.AttachmentId);
                    }

                    await _unitOfWork.Repository<Attachment>().DeleteWhereAsync(i => AttachmentIds.Contains(i.AttachmentId));
                }


                await _unitOfWork.CompleteAsync();

                return ApiResponseModel<string>.Success(GenericErrors.AddSuccess);
            }
            catch (Exception)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        public async Task<ApiResponseModel<string>> DeleteFile(int AttachmentId, string FileName, ActionTypes Type)
        {
            try
            {
                var File = _manageFileService.DeleteFile(FileName, Type.ToString());
                if (File.IsSuccess)
                    await _unitOfWork.Repository<Attachment>().DeleteWhereAsync(i => i.AttachmentId == AttachmentId);

                await _unitOfWork.CompleteAsync();

                return ApiResponseModel<string>.Success(GenericErrors.AddSuccess);
            }
            catch (Exception)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }
    }
}
