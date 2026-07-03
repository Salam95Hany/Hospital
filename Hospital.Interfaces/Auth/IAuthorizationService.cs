using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Interfaces.Auth
{
    public interface IAuthorizationService
    {
        bool IsSuperAdmin();
        bool CanEdit(DateTime createdDate);
    }
}
