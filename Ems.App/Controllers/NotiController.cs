using Ems.App.Servies.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Ems.App.Controllers
{
    public class IsDate { 
    public string Date { get; set; }

    }
    [Route("api/[controller]")]
    [ApiController]
    public class NotiController : ControllerBase
    {
        private readonly InterfaceCheckingService _notiService;

        public NotiController(InterfaceCheckingService notiService)
        {
            _notiService = notiService;
        }

        [HttpPost]
        [Route("saveData")]
        public IActionResult saveData([FromBody] IsDate date)
        {
            //var result = _notiService.saveData(date);
            return Ok();
        }
    }
}
