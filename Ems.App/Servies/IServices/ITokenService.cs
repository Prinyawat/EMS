using Ems.App.Models;
using System.Security.Claims;

namespace Ems.App.Servies.IServices
{
    public interface ITokenService
    {
        string GenerateAccessToken(IEnumerable<Claim> claims);
        string GenerateRefreshToken();
        UserModel GetUserByToken(string token);
    }
}
