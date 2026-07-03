using Hospital.Interfaces.Auth;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Hospital.Services.Auth
{
    public class AuthorizationService : IAuthorizationService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthorizationService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public bool IsSuperAdmin()
        {
            var role = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Role)?.Value;
            return string.Equals(role, "SupperAdmin", StringComparison.OrdinalIgnoreCase);
        }

        public bool CanEdit(DateTime createdDate)
        {
            if (IsSuperAdmin())
                return true;

            return (DateTime.UtcNow - createdDate).TotalDays <= 30;
        }
    }
}
