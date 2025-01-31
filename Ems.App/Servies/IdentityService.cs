using Ems.App.Servies.IServices;
using System.IdentityModel.Tokens.Jwt;

namespace Ems.App.Servies
{
    public class IdentityService : IIdentityService
    {
        private readonly IHttpContextAccessor _http;
        string CurrentUser;

        public IdentityService(IHttpContextAccessor http)
        {
            _http = http;
        }

        public string GetCurrentUser()
        {
            if (_http.HttpContext != null)
            {
                string beaer = _http.HttpContext.Request.Headers["Authorization"].ToString();
                if (!string.IsNullOrWhiteSpace(beaer))
                {
                    string token = beaer.Split(' ')[1];
                    var handler = new JwtSecurityTokenHandler();
                    JwtSecurityToken Jwt = handler.ReadJwtToken(token);
                    CurrentUser = Jwt.Claims.Where(claim => claim.Type == "name").Select(x => x.Value).FirstOrDefault();
                }
                else
                {
                    CurrentUser = "Unknow";
                }
            }
            else
            {
                CurrentUser = "Unknow";
            }

            return CurrentUser;
        }
    }
}
