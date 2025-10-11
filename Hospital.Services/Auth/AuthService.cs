using Hospital.Entities.Auth;
using Hospital.Entities.Common;
using Hospital.Interfaces.Auth;
using Hospital.Interfaces.Common;
using Hospital.Services.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Services.Auth
{
    public class AuthService: IAuthService
    {
        private readonly UserManager<AdminUser> _userManager;
        private readonly SignInManager<AdminUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ISQLHelper _sQLHelper;
        private readonly IJwtProvider _jwtProvider;

        public AuthService(UserManager<AdminUser> userManager, SignInManager<AdminUser> signInManager, RoleManager<IdentityRole> roleManager, IJwtProvider jwtProvider, ISQLHelper sQLHelper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _jwtProvider = jwtProvider;
            _sQLHelper = sQLHelper;
        }

        public async Task<DataTable> GetAllUsers()
        {
            var Params = new SqlParameter[0];
            var dt = await _sQLHelper.ExecuteDataTableAsync("web.SP_GetAllUsersData", Params);
            return dt;
        }

        public async Task<ApiResponseModel<ApplicationUserRespone>> AdminLogin(LoginModel request)
        {
            if (await _userManager.FindByNameAsync(request.UserName) is not { } user)
                return ApiResponseModel<ApplicationUserRespone>.Failure(GenericErrors.InvalidCredentials);

            var result = await _signInManager.PasswordSignInAsync(user, request.Password, false, false);

            if (result.Succeeded)
            {
                var (token, expiresIn) = _jwtProvider.GenerateToken(user);

                var roles = await _userManager.GetRolesAsync(user);
                var roleNme = roles.FirstOrDefault();
                user.IsActive = true;
                user.LoginDate = DateTime.UtcNow;
                await _userManager.UpdateAsync(user);

                string roleId = null;

                if (!string.IsNullOrEmpty(roleNme))
                {
                    var role = await _roleManager.FindByNameAsync(roleNme);
                    roleId = role?.Id;
                }

                ApplicationUserRespone userModel = new ApplicationUserRespone
                {
                    UserName = user.UserName,
                    Role = roleNme,
                    RoleId = roleId,
                    UserId = user.Id,
                    Token = token,
                    LoginDate = DateTime.UtcNow,
                    LoginDateAr = DateTime.UtcNow.ToString("dddd d MMMM , yyyy", new CultureInfo("ar-AE")),
                    LoginTimeAr = DateTime.UtcNow.ToString("hh:mm:ss t", new CultureInfo("ar-AE")),
                    ExpiresIn = expiresIn,
                };

                return ApiResponseModel<ApplicationUserRespone>.Success(GenericErrors.SuccessLogin, userModel);
            }

            return ApiResponseModel<ApplicationUserRespone>.Failure(GenericErrors.InvalidCredentials);
        }

        public async Task<ApiResponseModel<string>> CreateUser(AddUserModel model)
        {
            AdminUser appUser = new AdminUser
            {
                UserName = model.UserName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                Address = model.Address,
                IsActive = false
            };

            try
            {
                var result = await _userManager.CreateAsync(appUser, model.Password);

                if (result.Succeeded)
                {
                    bool adminRoleExists = await _roleManager.RoleExistsAsync(model.Role);
                    if (!adminRoleExists)
                        await _roleManager.CreateAsync(new IdentityRole(model.Role));

                    var roleAssignResult = await _userManager.AddToRoleAsync(appUser, model.Role);
                    if (!roleAssignResult.Succeeded)
                        return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);

                    return ApiResponseModel<string>.Success(GenericErrors.SuccessRegister);
                }
                else
                    return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
            catch (Exception ex)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        public async Task<ApiResponseModel<string>> EditUser(AddUserModel model)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(model.UserId);
                if (user == null)
                {
                    return ApiResponseModel<string>.Failure(GenericErrors.UserNotFound);
                }

                user.UserName = model.UserName;
                user.NormalizedUserName = model.UserName.ToUpperInvariant();
                user.Address = model.Address;
                user.PhoneNumber = model.PhoneNumber;
                user.Email = model.Email;
                user.NormalizedEmail = model.Email.ToUpperInvariant();

                if (!string.IsNullOrWhiteSpace(model.Password))
                {
                    var removePassResult = await _userManager.RemovePasswordAsync(user);
                    if (!removePassResult.Succeeded)
                        return ApiResponseModel<string>.Failure(GenericErrors.DeletePassFailed);

                    var addPassResult = await _userManager.AddPasswordAsync(user, model.Password);
                    if (!addPassResult.Succeeded)
                        return ApiResponseModel<string>.Failure(GenericErrors.NewPassFailed);
                }

                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                    return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);

                var roleAssignResult = await AssignNewRoleToUser(model.UserId, model.Role);
                if (!roleAssignResult)
                    return ApiResponseModel<string>.Failure(GenericErrors.UpdateRoleFailed);

                return ApiResponseModel<string>.Success(GenericErrors.UpdateSuccess);
            }
            catch (Exception)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        public async Task<ApiResponseModel<string>> DeleteUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return ApiResponseModel<string>.Failure(GenericErrors.UserNotFound);

            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Any())
            {
                var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, roles);
                if (!removeRolesResult.Succeeded)
                    return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
                return ApiResponseModel<string>.Failure(GenericErrors.DeleteSuccess);
            else
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
        }

        public async Task<ApiResponseModel<string>> AdminLogout(string UserId)
        {
            var user = await _userManager.FindByIdAsync(UserId);
            if (user == null)
                return ApiResponseModel<string>.Failure(GenericErrors.UserNotFound);

            user.IsActive = false;
            user.LoginDate = null;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);

            await _signInManager.SignOutAsync();

            return ApiResponseModel<string>.Success(GenericErrors.GetSuccess);
        }

        private async Task<bool> AssignNewRoleToUser(string userId, string newRole)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var currentRoles = await _userManager.GetRolesAsync(user);
            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded) return false;

            var addResult = await _userManager.AddToRoleAsync(user, newRole);
            return addResult.Succeeded;
        }
    }
}
