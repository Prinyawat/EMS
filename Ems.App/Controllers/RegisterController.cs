using Ems.App.Models;
using Ems.App.Servies;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Ems.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly IRegisterService _RegisterService;
        public RegisterController(IRegisterService RegisterService)
        {
            _RegisterService = RegisterService;
        }

        [HttpGet]
        [Route("getPosition")]
        public IActionResult getPosition()
        {
            var positionData = _RegisterService.getPosition();
            return Ok(positionData);
        }

        [Route("register")]
        [HttpPost]
        public IActionResult Register([FromBody] DataHubs newUser)
        {
             var res = _RegisterService.Register(newUser);
             return Ok(newUser);
        }
    }
}
