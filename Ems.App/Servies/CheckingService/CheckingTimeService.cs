using Ems.App.Servies.IServices;
using Ems.Data.Entities;

namespace Ems.App.Servies
{
    public class CheckingTimeService : InterfaceCheckingService
    {
        private readonly EmsContext _emsContext;

        public CheckingTimeService(EmsContext emsContext)
        {
            _emsContext = emsContext;
        }
        public List<DateTime> saveChecking(DateTime datetime)
        {

            var sortedByDate = _emsContext.check_in_out.OrderBy(co => co.check_in).ToList();
            check_in_out checkinout = new check_in_out()
            {
                user_id = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad"),
                check_in = DateTime.Now
            };

            _emsContext.check_in_out.Add(checkinout);
            _emsContext.SaveChanges();

            List<DateTime> datetimes = _emsContext.check_in_out
                                          .Where(x => x.check_in.HasValue)
                                          .Select(x => x.check_in.Value)
                                          .ToList();
            return datetimes;
        }
    }
}
