using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;

namespace Ems.App.Servies
{
    public class MenuService : IMenuService
    {
        private readonly EmsContext _emsContext;
        private readonly IIdentityService _identityService;

        public MenuService(EmsContext emsContext, IIdentityService identityService)
        {
            _emsContext = emsContext;
            _identityService = identityService;
        }

        public List<MenuModel> getMenus()
        {
            Guid userId = _identityService.GetCurrentUser();
            List<MenuModel> menuModels = (from ur in _emsContext.user_role.Where(x => x.user_id == userId)
                                          from mr in _emsContext.menu_role.Where(x => x.role_id == ur.role_id)
                                          from m in _emsContext.menu.Where(x => x.menu_id == mr.menu_id && x.active == true)
                                          select new MenuModel()
                                          {
                                              MenuId = m.menu_id,
                                              MenuParentId = m.menu_parent_id,
                                              MenuCode = m.menu_code,
                                              MenuName = m.menu_name,
                                              MenuIcon = m.menu_icon,
                                              MenuPath = m.menu_path,
                                              IsMenuParent = m.is_menu_parent.HasValue ? m.is_menu_parent.Value : false
                                          }).ToList();
            return menuModels;
        }
    }
}
