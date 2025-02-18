using Ems.App.Models;

namespace Ems.App.Servies.IServices
{
    public interface ILeaveRequestService
    {
        LeaveRequestModel saveleaveRequest(LeaveRequestModel leaveingData);

        List<LeaveHalfStatusModel> getLeaveRequestHalfStatus();

        //List<LeaveRequestModel> getLeaveRequestNoti();

        List<LeaveStatusDataModel> getLeaveRequestStatus();

        bool deleteLeaveRequest(Guid leaveRequestID);
        approveStatusModel saveAgendaApprove(approveStatusModel agendaStatusData);
        rejectStatusModel saveAgendaReject(rejectStatusModel agendaStatusData);
    }

}
