using NuGet.Packaging.Signing;

namespace Ems.App.Models
{
    public class LeaveRequestModel
    {
        public Guid selectedLeaveStatusId { get; set; }
        public Guid selectHalfStatusId { get; set; }
        public string selectedDates { get; set; }
        public string selectedLeaveStatus { get; set; }
        public string selectedLeaveHalfStatus { get; set; }
        public string startTime { get; set; }
        public string endTime { get; set; }
        public string additionalDescription { get; set; }
        //public IFormFile? uploadedFiles { get; set; }

    }

    public class LeaveStatusDataModel
    {
        public Guid leaveStatusId { get; set; }
        public string leaveStatusData{ get; set; }

    }

}
