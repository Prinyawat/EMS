using NuGet.Packaging.Signing;

namespace Ems.App.Models
{
    public class CheckingStatusModel
    {
        public string statuses { get; set; }
    }

    public class CheckingTimeDataModel
    {
        public string checkin { get; set; }
        public string checkout { get; set; }
        public string statuses { get; set; }

    }

}
