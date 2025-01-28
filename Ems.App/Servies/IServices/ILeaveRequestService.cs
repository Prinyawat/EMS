using Ems.App.Models;

namespace Ems.App.Servies.IServices
{
    public interface ILeaveRequestService
    {
        LeaveRequestModel saveleaveRequest(LeaveRequestModel data);

        LeaveStatusModel saveLeaveHalf(LeaveStatusModel statusData);

        List<LeaveRequestModel> getLeaveRequestNoti();
    }

}
