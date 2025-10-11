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
        public int Id { get; set; }
        public List<IFormFile> Files { get; set; } = [];
        public List<DeletedFileModel> DeletedFiles { get; set; } = [];
    }

    public class DeletedFileModel
    {
        public int Id { get; set; }
        public string FileName { get; set; }
    }

    public class FileSortingModel
    {
        public int FileId { get; set; }
        public int DisplayOrder { get; set; }
    }
}
