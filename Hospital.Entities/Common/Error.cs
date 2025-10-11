using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Common
{
    public class Error
    {
        public string Message { get; }

        public static readonly Error None = new Error(string.Empty);

        public Error(string message)
        {
            Message = message;
        }
    }
}
