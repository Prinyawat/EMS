using NuGet.Packaging.Signing;

namespace Ems.App.Models
{
    public class CheckingStatusModel
    {
        public string status { get; set; }
    }

    public class CheckingTimeDataModel
    {
        public DateTime? checkin { get; set; }
        public DateTime? checkout { get; set; }
        public string status { get; set; }

    }

    //public class TimeCompareModel
    //{
    //    public DateTime? originTime { get; set; }
    //}



}
