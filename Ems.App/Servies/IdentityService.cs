using Ems.App.Servies.IServices;
using System.IdentityModel.Tokens.Jwt;

namespace Ems.App.Servies
{
    public class IdentityService : IIdentityService
    {
        private readonly IHttpContextAccessor _http;
        Guid CurrentUser;

        public IdentityService(IHttpContextAccessor http)
        {
            _http = http;
        }

        public Guid GetCurrentUser()
        {
            if (_http.HttpContext != null)
            {
                string beaer = _http.HttpContext.Request.Headers["Authorization"].ToString();
                if (!string.IsNullOrWhiteSpace(beaer))
                {
                    string token = beaer.Split(' ')[1];
                    var handler = new JwtSecurityTokenHandler();
                    JwtSecurityToken Jwt = handler.ReadJwtToken(token);
                    CurrentUser = Jwt.Claims.Where(claim => claim.Type == "UserId").Select(x => new Guid(x.Value)).FirstOrDefault();
                }
                else
                {
                    CurrentUser = Guid.Empty;
                }
            }
            else
            {
                CurrentUser = Guid.Empty;
            }

            return CurrentUser;
        }
    }
}
