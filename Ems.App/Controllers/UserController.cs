using Ems.App.Models;
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

        [Route("getUser/{userId}")]
        [HttpGet]
        public IActionResult GetUser(Guid userId)
        {
            var res = _userService.GetUser(userId);
            return Ok(res);
        }

        [Route("updateUser/{userId}")]
        [HttpPut]
        public IActionResult UpdateUser(Guid userId, [FromBody] DataHubs updatedUser)
        {
            var res = _userService.UpdateUser(userId, updatedUser);
            return Ok(res);
        }
    }
}
