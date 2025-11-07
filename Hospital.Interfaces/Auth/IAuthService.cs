using Hospital.Entities.Auth;
using Hospital.Entities.Common;
using Hospital.Entities.Contracts.DTOs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Interfaces.Auth
{
    public interface IAuthService
    {
        Task<ApiResponseModel<List<UserWithRolesDto>>> GetAllUsers();
        Task<ApiResponseModel<ApplicationUserRespone>> AdminLogin(LoginModel request);
        Task<ApiResponseModel<string>> CreateUser(AddUserModel model);
        Task<ApiResponseModel<string>> EditUser(AddUserModel model);
        Task<ApiResponseModel<string>> DeleteUser(string userId);
        Task<ApiResponseModel<string>> AdminLogout(string UserId);
    }
}
