using Ems.App.Models;

namespace Ems.App.Servies.IServices
{
    public interface IUserService
    {
        UserModel Login(UserModel user);
    }
}
