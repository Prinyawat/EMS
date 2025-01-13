using Ems.App.Servies.IServices;
using Ems.Data.Entities;

namespace Ems.App.Servies
{
    public class HomeService : IHomeService
    {
        private readonly EmsContext _emsContext;

        public HomeService(EmsContext emsContext)
        {
            _emsContext = emsContext;
        }

        public List<string> getItems()
        {
            int count = _emsContext.position.Count();
            position position = new position()
            {
                position_name = "Dev" + (count + 1),
            };
            _emsContext.position.Add(position);
            _emsContext.SaveChanges();

            List<string> strings = _emsContext.position.Select(x => x.position_name).ToList();

            return strings;
        }
    }
}
