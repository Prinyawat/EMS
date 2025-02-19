using NuGet.Packaging.Signing;

namespace Ems.App.Models
{
    public class LeaveRequestModel
    {
        public Guid agendaStatusId { get; set; }
        public Guid UserId { get; set; }
        public Guid selectedLeaveStatusId { get; set; }
        public Guid selectHalfStatusId { get; set; }
        public string selectedDates { get; set; }
        public string selectedLeaveStatus { get; set; }
        public string selectedLeaveHalfStatus { get; set; }
        public TimeOnly startTime { get; set; }
        public TimeOnly endTime { get; set; }
        public string additionalDescription { get; set; }
    }

    public class LeaveStatusDataModel
    {
        public Guid leaveStatusId { get; set; }
        public string leaveStatusData{ get; set; }

    }

    public class approveStatusModel
    {
        public Guid approveStatusId { get; set; }
        public Guid leaveRequestID { get; set; }
    }

    public class rejectStatusModel
    {
        public Guid rejectStatusId { get; set; }
        public Guid leaveRequestID { get; set; }
    }

    public class updateStatusModel
    {
        public Guid leaveRequestID { get; set; }
        public DateTime checkingDate { get; set; }
        public TimeOnly startTime { get; set; }
        public TimeOnly endTime { get; set; }
        public string selectedLeaveHalfStatus { get; set; }
        public string leaveStatuses { get; set; }
        public string additionalDescription { get; set; }
    }
}
