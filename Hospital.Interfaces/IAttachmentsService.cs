using Hospital.Entities.Common;
using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Interfaces
{
    public interface IAttachmentsService
    {
        Task<ApiResponseModel<List<Attachment>>> GetFilesByActionId(int ActionId, ActionTypes ActionType);
        Task<ApiResponseModel<string>> AddActionFiles(UploadFileModel Model);
    }
}
