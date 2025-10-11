using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Services.Common
{
    public class TempPhysicalFileResult: PhysicalFileResult
    {
        public TempPhysicalFileResult(string fileName, string contentType) : base(fileName, contentType) { }

        public override async Task ExecuteResultAsync(ActionContext context)
        {
            try
            {
                await base.ExecuteResultAsync(context);
            }
            finally
            {
                File.Delete(FileName);
            }
        }
    }
}
