using Ems.App.Entities;
using Ems.App.Servies.IServices;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;

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

            var sortedByDate = _emsContext.CheckInOuts.OrderBy(co => co.CheckIn).ToList();

            CheckInOut checkinout = new CheckInOut()
            {
                UserId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad"),
                CheckIn = DateTime.Now,
                CreateBy = "Dev Asia",
                CreateDate = DateTime.Now,
                UpdateBy = "Dev Asia"
            };

            _emsContext.CheckInOuts.Add(checkinout);
            _emsContext.SaveChanges();

            List<DateTime> datetimes = _emsContext.CheckInOuts
                                          .Where(x => x.CheckIn.HasValue)
                                          .Select(x => x.CheckIn.Value)
                                          .ToList();
            return datetimes;
        }
    }
}
