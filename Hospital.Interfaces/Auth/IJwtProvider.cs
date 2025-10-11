using Hospital.Entities.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Interfaces.Auth
{
    public interface IJwtProvider
    {
        (string token, int expiresIn) GenerateToken(AdminUser user);
        string? ValidateToken(string token);
    }
}
