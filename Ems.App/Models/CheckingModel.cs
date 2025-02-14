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

    public class NotiAgendaModel
    {
        public Guid leaveRequestID { get; set; }
        public Guid UserID { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string checkingDate { get; set; }
        public string startTime { get; set; }
        public string endTime { get; set; }
        public string selectedLeaveHalfStatus { get; set; }
        public string leaveStatus { get; set; }
        public string additionalDescription { get; set; }
    }

    public class HeaderAgendaModel
    {
        public string firstName { get; set; }
        public string lastName { get; set; }
    }
}
