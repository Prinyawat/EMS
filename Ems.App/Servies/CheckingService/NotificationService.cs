using Ems.App.Servies.IServices;
using Ems.Data.Entities;

namespace Ems.App.Servies
{
    public class NotificationService : InterfaceNotificationService
    {
        private readonly EmsContext _emsContext;

        public NotificationService(EmsContext emsContext)
        {
            _emsContext = emsContext;
        }
        public List<string> saveData(string date)
        {

            int count = _emsContext.check_in_out.Count();
            check_in_out checkinout = new check_in_out()
            {
                check_dates = DateTime.Parse(date),
            };

            _emsContext.check_in_out.Add(checkinout);
            _emsContext.SaveChanges();

            List<string> strings = _emsContext.check_in_out
                                          .Select(x => x.check_dates.ToString("yyyy-MM-dd"))
                                          .ToList();
            return strings;
        }
    }
}
