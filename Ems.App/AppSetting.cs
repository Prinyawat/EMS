namespace Ems.App
{
    public class AppSetting
    {
        public string Secret { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string SystemName { get; set; }
        public int DurationInMinutes { get; set; }


        //:: Images migration from directory (Drive D) ::
        //public AttachmentMigrationConfig AttachmentMigrationConfig { get; set; }
    }
}
