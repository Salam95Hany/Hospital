using Hospital.Entities.Auth;
using Hospital.Entities.Common;
using Hospital.Interfaces.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace Hospital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpGet]
        [Route("GetAllUsers")]
        public async Task<ApiResponseModel<DataTable>> GetAllUsers()
        {
            var results = await _authService.GetAllUsers();
            return results;
        }

        [HttpPost]
        [Route("AdminLogin")]
        public async Task<ApiResponseModel<ApplicationUserRespone>> AdminLogin(LoginModel model)
        {
            var results = await _authService.AdminLogin(model);
            return results;
        }

        [HttpGet]
        [Route("AdminLogout")]
        public async Task<ApiResponseModel<string>> AdminLogout(string UserId)
        {
            var results = await _authService.AdminLogout(UserId);
            return results;
        }

        [HttpPost]
        [Route("CreateUser")]
        public async Task<ApiResponseModel<string>> CreateUser(AddUserModel model)
        {
            var results = await _authService.CreateUser(model);
            return results;
        }

        [HttpPost]
        [Route("EditUser")]
        public async Task<ApiResponseModel<string>> EditUser(AddUserModel model)
        {
            var results = await _authService.EditUser(model);
            return results;
        }

        [HttpGet]
        [Route("DeleteUser")]
        public async Task<ApiResponseModel<string>> DeleteUser(string UserId)
        {
            var results = await _authService.DeleteUser(UserId);
            return results;
        }
    }
}
