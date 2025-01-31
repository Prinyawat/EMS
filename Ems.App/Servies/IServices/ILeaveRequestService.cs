using Ems.App.Models;

namespace Ems.App.Servies.IServices
{
    public interface ILeaveRequestService
    {
        void saveleaveRequest(LeaveRequestModel leaveingData);

        List<LeaveHalfStatusModel> getLeaveRequestHalfStatus();

        //List<LeaveRequestModel> getLeaveRequestNoti();

        List<LeaveStatusDataModel> getLeaveRequestStatus();
    }

}
