using Ems.App.Entities;
using Ems.App.Models;
using Ems.App.Servies;
using Ems.App.Servies.IServices;
using Microsoft.AspNetCore.Http;
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
        public IActionResult Login(UserModel user)
        {
            var res = _userService.Login(user);
            return Ok(new UserModel()
            {
                UserId = res.UserId,
                Firstname = res.Firstname,
                Lastname = res.Lastname,
                Email = res.Email,
                Token = res.Token,
                RefreshToken = res.RefreshToken
            });
        }
    }
}
