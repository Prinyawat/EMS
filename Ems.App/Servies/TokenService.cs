using Ems.App.Entities;
using Ems.App.Enums;
using Ems.App.Models;
using Ems.App.Servies.IServices;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Owin.Security.DataHandler.Encoder;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Web.Http;

namespace Ems.App.Servies
{
    public class TokenService : ITokenService
    {
        private readonly EmsContext _emsContext;
        private readonly AppSetting _appSettings;
        public TokenService(IOptions<AppSetting> appSettings, EmsContext emsContext)
        {
            _appSettings = appSettings.Value;
            _emsContext = emsContext;
        }



        string ITokenService.GenerateAccessToken(IEnumerable<Claim> claims)
        {
            var keyByteArray = new SymmetricSecurityKey(TextEncodings.Base64Url.Decode(_appSettings.Secret));
            JwtSecurityToken token = new JwtSecurityToken(
                    issuer: _appSettings.Issuer,
                    audience: _appSettings.Audience,
                    claims: claims,
                    notBefore: DateTime.Now,
                    DateTime.Now.AddMinutes(_appSettings.DurationInMinutes),
                    new SigningCredentials(keyByteArray, SecurityAlgorithms.HmacSha256Signature)
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        string ITokenService.GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        public UserModel GetUserByToken(string token)
        {
            UserModel userData = null;

            if (ValidateToken(token))
            {
                TokenValidationParameters tokenValidateParameter = GetValidationParameters();
                SecurityToken validateToken;
                var handler = new JwtSecurityTokenHandler();
                ClaimsPrincipal pricipal = handler.ValidateToken(token, tokenValidateParameter, out validateToken);
                var userDataId = pricipal.FindFirst(CustomClaimTypes.UserId);

                if (string.IsNullOrEmpty(userDataId.Value))
                    throw new HttpResponseException(HttpStatusCode.Unauthorized);
                userData = GetUser(new Guid(userDataId.Value));
            }

            return userData;

        }

        public bool ValidateToken(string token)
        {
            bool IsValid = false;

            TokenValidationParameters tokenValidateParameter = GetValidationParameters();
            SecurityToken validateToken;
            var handler = new JwtSecurityTokenHandler();
            try
            {
                IPrincipal pricipal = handler.ValidateToken(token, tokenValidateParameter, out validateToken);
                IsValid = pricipal.Identity.IsAuthenticated;
                return IsValid;

            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }


        public TokenValidationParameters GetValidationParameters()
        {
            return new TokenValidationParameters
            {
                ValidateLifetime = false,
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                ValidAudience = _appSettings.Audience,
                ValidIssuer = _appSettings.Issuer,
                IssuerSigningKey = new SymmetricSecurityKey(TextEncodings.Base64Url.Decode(_appSettings.Secret)),
                ClockSkew = TimeSpan.Zero
            };
        }


        private UserModel GetUser(Guid userId)
        {

            UserModel userData = _emsContext.Users
                                .Where(x => x.UserId == userId)
                                .Select(x => new UserModel()
                                {
                                    UserId = x.UserId,
                                    Email = x.Email
                                }).FirstOrDefault();
            return userData;
        }
    }
}
