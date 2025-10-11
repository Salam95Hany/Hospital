using Hospital.Entities.Common;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Interfaces.Common
{
    public interface IManageFileService
    {
        Task<ApiResponseModel<string>> UploadFile(IFormFile File, string OldFileName, string FolderName);
        ApiResponseModel<string> DeleteFile(string FileName, string FolderName);
    }
}
