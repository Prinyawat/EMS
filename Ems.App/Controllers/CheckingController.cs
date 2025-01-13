using Ems.App.Servies.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ems.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckingController : ControllerBase
    {
        private readonly InterfaceCheckingService _checkingservice;
        public CheckingController(InterfaceCheckingService checkingservice)
        {
            _checkingservice = checkingservice;
        }

        [HttpPost]
        [Route("saveChecking")]
        public List<DateTime> saveChecking(DateTime timestamp)
        {
            return _checkingservice.saveChecking(timestamp);
        }
    }
}
