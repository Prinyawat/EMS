using System.IO;
using System.Linq;
using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Ems.App.Servies
{
    public class LeaveRequestService : ILeaveRequestService
    {
        private readonly EmsContext _emsContext;
        private readonly IHubContext<NotificationHub> _hubContext;

        public LeaveRequestService(EmsContext emsContext, IHubContext<NotificationHub> hubContext)
        {
            _emsContext = emsContext;
            _hubContext = hubContext;
        }

        public LeaveRequestModel saveleaveRequest(LeaveRequestModel formData)
        {
            var DuplicateRequest = _emsContext.leave_request
            .FirstOrDefault(r => r.user_id == formData.UserId && r.leave_request_date == formData.selectedDates);

            if (DuplicateRequest != null)
            {
               throw new Exception("LeaveRequest Duplicate");
            }

            var leaveRequestEntity = new leave_request
                {
                    user_id = formData.UserId,
                    leave_request_date = formData.selectedDates,
                    leave_request_status_id = formData.selectedLeaveStatusId,
                    leave_half_id = formData.selectHalfStatusId,
                    status_name = formData.selectedLeaveStatus,
                    leave_start_time = formData.startTime,
                    leave_end_time = formData.endTime,
                    leave_request_description = formData.additionalDescription,
                };

                _emsContext.leave_request.Add(leaveRequestEntity);
                _emsContext.SaveChanges();

                _emsContext.Entry(leaveRequestEntity).Reload();

            var user = _emsContext.user.FirstOrDefault(u => u.user_id == formData.UserId);
            var HalfstatusName = _emsContext.leave_half.FirstOrDefault(u => u.leave_half_id == formData.selectHalfStatusId);
            var statusName = _emsContext.leave_request.FirstOrDefault(s => s.leave_request_status_id == formData.selectedLeaveStatusId);

            if (user == null || HalfstatusName == null || statusName == null)
            {
                throw new Exception("ข้อมูลที่จำเป็นบางประการไม่ครบถ้วน (user, HalfstatusName, statusName)");
            }

            SendLeaveRequestNotification(user, statusName, HalfstatusName, leaveRequestEntity);

            return new LeaveRequestModel { }; 
        }

        private void SendLeaveRequestNotification(user user, leave_request statusName, leave_half HalfstatusName, leave_request leaveRequestEntity)
        {
            var message = $"{user.first_name} ได้ทำการยื่นคำขอ {statusName.status_name} {HalfstatusName.leave_type_name} ณ วัน {leaveRequestEntity.leave_request_date:dd/MM/yyyy}";
            Console.WriteLine("Sending notification: " + message);
            _hubContext.Clients.All.SendAsync("ReceiveNotification", message);
        }


        public List<LeaveHalfStatusModel> getLeaveRequestHalfStatus()
        {
            return _emsContext.leave_half
                .Select(r => new LeaveHalfStatusModel
                {   
                    
                    leaveHalfId = r.leave_half_id,
                    halfStatus = r.leave_type_name

                }).ToList();
        }

        public List<LeaveStatusDataModel> getLeaveRequestStatus()
        {

            return _emsContext.leave_request_status
                .Select(r => new LeaveStatusDataModel
                {
                    leaveStatusId = r.leave_request_status_id,
                    leaveStatusData = r.leave_request_status_name

                }).ToList();
        }
    }
}
