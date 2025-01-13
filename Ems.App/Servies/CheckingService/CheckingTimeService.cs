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
        public List<int> saveChecking(DateTime datetime)
        {

            //int count = _emsContext.CheckInOuts.Count();  
            //CheckInOut checkinout = new CheckInOut()
            //{
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
        }
    }
}
