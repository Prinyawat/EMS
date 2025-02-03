using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;


namespace Ems.App.Servies
{
    public class RegisterService : IRegisterService
    {
        private readonly EmsContext _emsContext;

        public RegisterService(EmsContext emsContext)
        {
            _emsContext = emsContext;
        }

        public List<Positiondata> getPosition()
        {
            return _emsContext.position
                .Where(r => r.position_name.ToLower() != "admin")
                .Select(r => new Positiondata
                {
                    positionId = r.position_id,
                    positionName = r.position_name
                }).ToList();
        }

    }
}
