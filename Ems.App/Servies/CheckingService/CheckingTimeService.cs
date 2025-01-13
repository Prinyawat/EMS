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
        public List<int> saveChecking(DateTime datetime)
        {

            var sortedByDate = _emsContext.check_in_out.OrderBy(co => co.check_in).ToList();
            check_in_out checkinout = new check_in_out()
            {
                //    CheckDates = DateTime.Parse(date), 
                //    CreateBy = "Dev Asia",
                //    CreateDate = DateTime.Now
                //};

                //_emsContext.CheckInOuts.Add(checkinout); 
                //_emsContext.SaveChanges();  

                //List<string> strings = _emsContext.CheckInOuts
                //                              .Select(x => x.CheckDates.ToString("yyyy-MM-dd"))
                //                              .ToList();
                //return strings;

            };
            return new List<int>();
        }
    }
}
