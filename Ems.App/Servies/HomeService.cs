using Ems.App.Entities;
using Ems.App.Servies.IServices;

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
            int count = _emsContext.Positions.Count();
            Position position = new Position()
            {
                PositionName = "Dev" + (count + 1),
            };
            _emsContext.Positions.Add(position);
            _emsContext.SaveChanges();

            List<string> strings = _emsContext.Positions.Select(x => x.PositionName).ToList();

            return strings;
        }
    }
}
