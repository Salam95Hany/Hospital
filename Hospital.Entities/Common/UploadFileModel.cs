using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Common
{
    public class UploadFileModel
    {
        public int? ActionId { get; set; }
        public ActionTypes? ActionType { get; set; }  // Patient = 1, Admission = 2, SurgicalIntervention = 3, FollowUp = 4
        public string InsertUser { get; set; }
        public List<FileModel> Files { get; set; } = [];
        public List<DeletedFileModel> DeletedFiles { get; set; } = [];
    }

    public class FileModel
    {
        public int AttachmentId { get; set; }
        public string FileName { get; set; }
        public string ExistFileName { get; set; }
        public string FileSize { get; set; }
        public IFormFile File { get; set; }
    }

    public class DeletedFileModel
    {
        public int AttachmentId { get; set; }
        public string FileName { get; set; }
    }
}
