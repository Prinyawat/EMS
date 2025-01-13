using Ems.App.Entities;
using Ems.App.Enums;
using Ems.App.Models;
using Ems.App.Servies.IServices;
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
            User user = this._emsContext.Users.Where(x => (x.Email + "").ToLower() == (userModel.Email + "").ToLower() && x.Password == userModel.Password).FirstOrDefault();
            if (user == null)
            {
                throw new Exception("User not found");
            }
            else
            {
                List<Claim> usersClaims = new List<Claim>()
                        {
                            new Claim(CustomClaimTypes.UserId, user.UserId.ToString()),
                            new Claim(ClaimTypes.Name, user.Email)
                        };

                string jwtToken = _tokenService.GenerateAccessToken(usersClaims);
                string refreshToken = _tokenService.GenerateRefreshToken();
                userModel.Firstname = user.FirstName;
                userModel.Lastname = user.LastName;
                userModel.Token = jwtToken;
                userModel.RefreshToken = refreshToken;
                return userModel;
            }
        }
    }
}
