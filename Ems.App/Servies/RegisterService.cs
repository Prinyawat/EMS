using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;


namespace Ems.App.Servies
{
    public class RegisterService : IRegisterService
    {
        private readonly EmsContext _emsContext;
        private readonly IIdentityService _identityService;

        public RegisterService(EmsContext emsContext, IIdentityService identityService)
        {
            _emsContext = emsContext;
            _identityService = identityService;
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

        public DataHubs Register(DataHubs newUser)
        {
            if (string.IsNullOrWhiteSpace(newUser.Email) || !newUser.Email.Contains("@"))
            {
                throw new Exception("Invalid email format. Email must contain '@gmail.com'.");
            }

            if (_emsContext.user.Any(u => u.email == newUser.Email))
            {
                throw new Exception("Email is already registered.");
            }

            if (newUser.positionId == Guid.Empty)
            {
                throw new Exception("Position is required.");
            }

            var position = _emsContext.position.FirstOrDefault(p => p.position_id == newUser.positionId);
            if (position == null)
            {
                throw new Exception("Invalid position.");
            }

            var user = new user
            {
                user_id = Guid.NewGuid(),
                first_name = newUser.Firstname,
                last_name = newUser.Lastname,
                email = newUser.Email,
                phone = newUser.phone,
                password = newUser.Password,
                position_id = newUser.positionId 
            };

            _emsContext.user.Add(user);
            _emsContext.SaveChanges();

            return new DataHubs
            {
                UserId = user.user_id,
                Firstname = user.first_name,
                Lastname = user.last_name,
                Email = user.email,
                positionId = position.position_id,  
                positionName = position.position_name
            };
        }
    }
}
