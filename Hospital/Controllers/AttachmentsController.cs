using Hospital.Entities.Common;
using Hospital.Services.Common;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Hospital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttachmentsController : ControllerBase
    {
        private readonly Interfaces.IAttachmentsService _attachmentsService;
        private readonly string _webRootPath;
        public AttachmentsController(IOptions<AppPaths> options, Interfaces.IAttachmentsService attachmentsService)
        {
            _webRootPath = options.Value.WebRootPath;
            _attachmentsService = attachmentsService;
        }

        [HttpGet("DownloadFile")]
        public IActionResult DownloadFile(string FileName, ActionTypes Type)
        {
            string FilePath = Path.Combine(_webRootPath, Type.ToString(), FileName);
            string FileType = Path.GetExtension(FileName).Substring(1);

            if (!System.IO.File.Exists(FilePath))
                return NotFound(new { message = "The file is not exist" });

            var contentType = $"application/{FileType}";

            return PhysicalFile(FilePath, contentType, FileName);
        }

        [HttpGet("DeleteFile")]
        public async Task<ApiResponseModel<string>> DeleteFile(int AttachmentId, string FileName, ActionTypes Type)
        {
            var Results = await _attachmentsService.DeleteFile(AttachmentId, FileName, Type);
            return Results;
        }
    }
}
