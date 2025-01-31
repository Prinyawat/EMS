namespace Ems.App.Models
{
    public class MenuModel
    {
        public Guid MenuId { get; set; }
        public Guid? MenuParentId { get; set; }
        public string MenuCode { get; set; }
        public string MenuName { get; set; }
        public string MenuIcon { get; set; }
        public string MenuPath { get; set; }
        public bool IsMenuParent { get; set; }
        public bool Active { get; set; }
    }
}
