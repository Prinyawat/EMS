using NuGet.Packaging.Signing;

namespace Ems.App.Models
{
    public class CheckingStatusModel
    {
        public string statuses { get; set; }
    }

    public class CheckingTimeDataModel
    {
        public DateTime? checkin { get; set; }
        public DateTime? checkout { get; set; }
        public string statuses { get; set; }

    }

}
