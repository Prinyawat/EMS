using Ems.App.Enums;
using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Ems.App.Servies
{
    public class UserService : IUserService
    {
        private readonly EmsContext _emsContext;
        private readonly ITokenService _tokenService;

        private readonly IHubContext<NotificationHub> _hubContext;
        public UserService(EmsContext emsContext, ITokenService tokenService, IHubContext<NotificationHub> hubContext)
        {
            _emsContext = emsContext;
            _tokenService = tokenService;

            _hubContext = hubContext;
        }

        public DataHubs Login(DataHubs userModel)
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

        public DataHubs GetUser(Guid userId)
        {
            var user = _emsContext.user
                .Include(u => u.position) 
                .FirstOrDefault(u => u.user_id == userId);

            if (user == null)
            {
                throw new Exception("User not found");
            }

            return new DataHubs
            {
                UserId = user.user_id,
                Firstname = user.first_name,
                Lastname = user.last_name,
                Email = user.email,
                phone = user.phone,
                positionName = user.position?.position_name
            };
        }

        //public DataHubs UpdateUser(Guid userId, DataHubs updatedUser)
        //{
        //    var user = _emsContext.user.FirstOrDefault(u => u.user_id == userId);

        //    if (user == null)
        //    {
        //        throw new Exception("User not found");
        //    }

        //    user.first_name = updatedUser.Firstname ?? user.first_name;
        //    user.last_name = updatedUser.Lastname ?? user.last_name;
        //    user.email = updatedUser.Email ?? user.email;
        //    user.phone = updatedUser.phone ?? user.phone;
        //    user.updated_by = userId.ToString(); 

        //    _emsContext.SaveChanges(); 

        //    return new DataHubs
        //    {
        //        UserId = user.user_id,
        //        Firstname = user.first_name,
        //        Lastname = user.last_name,
        //        Email = user.email,
        //        phone = user.phone,
        //        positionName = user.position?.position_name
        //    };
        //}

        public DataHubs UpdateUser(Guid userId, DataHubs updatedUser)
        {
            var user = _emsContext.user.FirstOrDefault(u => u.user_id == userId);

            if (user == null)
            {
                throw new Exception("User not found");
            }

            user.first_name = updatedUser.Firstname ?? user.first_name;
            user.last_name = updatedUser.Lastname ?? user.last_name;
            user.email = updatedUser.Email ?? user.email;
            user.phone = updatedUser.phone ?? user.phone;
            user.updated_by = userId.ToString();

            _emsContext.SaveChanges();

            var response = new DataHubs
            {
                UserId = user.user_id,
                Firstname = user.first_name,
                Lastname = user.last_name,
                Email = user.email,
                phone = user.phone,
                positionName = user.position?.position_name
            };

            // ✅ แจ้งให้ทุก Client ทราบว่ามีการอัปเดต
            _hubContext.Clients.All.SendAsync("UserUpdated", response);

            return response;
        }
    }
}
