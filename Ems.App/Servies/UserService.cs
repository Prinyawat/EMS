using Ems.App.Enums;
using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using System.Security.Claims;

namespace Ems.App.Servies
{
    public class UserService : IUserService
    {
        private readonly EmsContext _emsContext;
        private readonly ITokenService _tokenService;
        public UserService(EmsContext emsContext, ITokenService tokenService)
        {
            _emsContext = emsContext;
            _tokenService = tokenService;
        }

        public UserModel Login(UserModel userModel)
        {
            user user = this._emsContext.user.Where(x => (x.email + "").ToLower() == (userModel.Email + "").ToLower() && x.password == userModel.Password).FirstOrDefault();
            if (user == null)
            {
                throw new Exception("User not found");
            }
            else
            {
                List<Claim> usersClaims = new List<Claim>()
                        {
                            new Claim(CustomClaimTypes.UserId, user.user_id.ToString()),
                            new Claim(ClaimTypes.Name, user.email)
                        };

                string jwtToken = _tokenService.GenerateAccessToken(usersClaims);
                string refreshToken = _tokenService.GenerateRefreshToken();
                userModel.Firstname = user.first_name;
                userModel.Lastname = user.last_name;
                userModel.Token = jwtToken;
                userModel.RefreshToken = refreshToken;
                return userModel;
            }
        }
    }
}
