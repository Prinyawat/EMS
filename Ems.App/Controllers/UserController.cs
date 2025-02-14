using Ems.App.Models;
using Ems.App.Servies;
using Ems.App.Servies.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Ems.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Route("login")]
        [HttpPost]
        public IActionResult Login(DataHubs user)
        {
            var res = _userService.Login(user);
            return Ok(new DataHubs()
            {
                UserId = res.UserId,
                Firstname = res.Firstname,
                Lastname = res.Lastname,
                Email = res.Email,
                Token = res.Token,
                RefreshToken = res.RefreshToken
            });
        }

        [Route("getUser")]
        [HttpGet]
        public IActionResult GetUser()
        {
            var res = _userService.GetUser();
            return Ok(res);
        }

        [Route("updateUser")]
        [HttpPut]
        public IActionResult UpdateUser([FromBody] DataHubs updatedUser)
        {
            var res = _userService.UpdateUser(updatedUser);
            return Ok(res);
        }

        [Route("getAllUser")]
        [HttpGet]
        public IActionResult getAllUser()
        {
            var res = _userService.GetAllUser();
            return Ok(res);
        }

    }
}
