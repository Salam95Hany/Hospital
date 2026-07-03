using Hospital.Entities.Auth;
using Hospital.Interfaces.Auth;
using Hospital.Interfaces.Common;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Hospital.Services.Auth
{
    public class JwtProvider : IJwtProvider
    {
        private readonly IAppSettings _appSettings;
        public JwtProvider(IAppSettings appSettings)
        {
            _appSettings = appSettings;
        }

        public (string token, int expiresIn) GenerateToken(AdminUser user, string RoleName)
        {
            Claim[] claims = [
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(JwtRegisteredClaimNames.GivenName, user.UserName),
            new(JwtRegisteredClaimNames.FamilyName, user.UserName),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.Role, RoleName)
            ];

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.Jwt.Key));
            var singingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _appSettings.Jwt.Issuer,
                audience: _appSettings.Jwt.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_appSettings.Jwt.ExpiryMinutes),
                signingCredentials: singingCredentials
            );

            return (token: new JwtSecurityTokenHandler().WriteToken(token), expiresIn: _appSettings.Jwt.ExpiryMinutes * 60);
        }

        public string? ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.Jwt.Key));

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    IssuerSigningKey = symmetricSecurityKey,
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;

                return jwtToken.Claims.First(x => x.Type == JwtRegisteredClaimNames.Sub).Value;
            }
            catch
            {

                return null;
            }
        }
    }
}
