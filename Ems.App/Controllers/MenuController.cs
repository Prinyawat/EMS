using Ems.App.Models;
using Ems.App.Servies.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ems.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _menuService;
        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }

        [HttpGet]
        [Route("getMenus")]
        public List<MenuModel> getMenus()
        {
            return _menuService.getMenus();
        }
    }
}
