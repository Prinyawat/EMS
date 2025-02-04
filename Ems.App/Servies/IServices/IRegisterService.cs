using Ems.App.Models;

namespace Ems.App.Servies.IServices
{
    public interface IRegisterService
    {
        List<Positiondata> getPosition();
        DataHubs Register(DataHubs newUser);

    }
}
