using Ems.App.Models;

namespace Ems.App.Servies.IServices
{
    public interface IUserService
    {
        DataHubs Login(DataHubs user);
        DataHubs GetUser();
        DataHubs UpdateUser(DataHubs updatedUser);
        List<DataHubs> GetAllUser();
    }
}
