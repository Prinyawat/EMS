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
         private readonly IIdentityService _identityService;
        public LeaveRequestService(EmsContext emsContext, IHubContext<NotificationHub> hubContext, IIdentityService identityService)
        {
            _emsContext = emsContext;
            _hubContext = hubContext;
            _identityService = identityService;
        }

        public LeaveRequestModel saveleaveRequest(LeaveRequestModel formData)
        {
            var userId1 = this._identityService.GetCurrentUser();

            //string formattedStartTime = formData.startTime + " น.";
            //string formattedEndTime = formData.endTime + " น.";

            var selectedDates = formData.selectedDates.Split(',')
                .Select(date => date.Trim())
                .Where(date => !string.IsNullOrEmpty(date))
                .ToList();

            foreach (var date in selectedDates)
            {

                var DuplicateRequest = _emsContext.leave_request
                    .Where(r => r.user_id == userId1 && r.leave_request_date == date)
                    .ToList();

                if (DuplicateRequest.Any())
                {
                    throw new Exception($"LeaveRequest Duplicate ในวันที่ {date}");
                }

                var leaveRequestEntity = new leave_request
                {
                    user_id = userId1,
                    leave_request_date = date, 
                    leave_request_status_id = formData.selectedLeaveStatusId,
                    leave_half_id = formData.selectHalfStatusId,
                    status_name = formData.selectedLeaveStatus,
                    leave_start_time = formData.startTime,
                    leave_end_time = formData.endTime,
                    leave_request_description = formData.additionalDescription,
                    agenda_status_id = new Guid("56c99f7b-ada2-4c63-a949-2165c708d9ea")
                };

                _emsContext.leave_request.Add(leaveRequestEntity);
                _emsContext.SaveChanges();
                _emsContext.Entry(leaveRequestEntity).Reload();

                //var userGuid = userId1;
                //var HalfstatusName = _emsContext.leave_half.FirstOrDefault(u => u.leave_half_id == formData.selectHalfStatusId);
                //var statusName = _emsContext.leave_request_status.FirstOrDefault(s => s.leave_request_status_id == formData.selectedLeaveStatusId);

                //SendLeaveRequestNotification(userId1, statusName, HalfstatusName, leaveRequestEntity);
            }

            return new LeaveRequestModel();
        }


        //private void SendLeaveRequestNotification(user userGuid, leave_request_status statusName, leave_half HalfstatusName, leave_request leaveRequestEntity)
        //{
        //    var message = $"ยื่นคำขอ {statusName.leave_request_status_name} {HalfstatusName.leave_type_name} ณ วัน {leaveRequestEntity.leave_request_date:dd/MM/yyyy}";
        //    Console.WriteLine("Sending notification: " + message);
        //    _hubContext.Clients.All.SendAsync("ReceiveNotification", message);
        //}


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

        public bool deleteLeaveRequest(Guid leaveRequestID)
        {
            var leaveRequestToDelete = _emsContext.leave_request.FirstOrDefault(c => c.leave_request_id == leaveRequestID);
            if (leaveRequestToDelete == null)
            {
                return false;
            }

            _emsContext.leave_request.Remove(leaveRequestToDelete);
            _emsContext.SaveChanges();
            return true;
        }

        public approveStatusModel saveAgendaApprove(approveStatusModel agendaStatusData)
        {
            var validStatusData = (from leaveRequest in _emsContext.leave_request
                                   join agendaStatus in _emsContext.agenda_status
                                   on agendaStatusData.approveStatusId equals agendaStatus.agenda_status_id
                                   where leaveRequest.leave_request_id == agendaStatusData.leaveRequestID
                                   select new
                                   {
                                       LeaveRequest = leaveRequest,
                                       AgendaStatus = agendaStatus
                                   }).FirstOrDefault();

            if (validStatusData != null)
            {
                var validAgendaStatus = _emsContext.agenda_status
                    .FirstOrDefault(a => a.agenda_status_id == agendaStatusData.approveStatusId);

                if (validAgendaStatus != null)
                {
                    validStatusData.LeaveRequest.agenda_status_id = validAgendaStatus.agenda_status_id;

                    _emsContext.SaveChanges();
                }
            }
       
            _emsContext.SaveChanges();

            return agendaStatusData;
        }

        public rejectStatusModel saveAgendaReject(rejectStatusModel agendaStatusData)
        {
            var validStatusData = (from leaveRequest in _emsContext.leave_request
                                   join agendaStatus in _emsContext.agenda_status
                                   on agendaStatusData.rejectStatusId equals agendaStatus.agenda_status_id
                                   where leaveRequest.leave_request_id == agendaStatusData.leaveRequestID
                                   select new
                                   {
                                       LeaveRequest = leaveRequest,
                                       AgendaStatus = agendaStatus
                                   }).FirstOrDefault();

            if (validStatusData != null)
            {
                var validAgendaStatus = _emsContext.agenda_status
                    .FirstOrDefault(a => a.agenda_status_id == agendaStatusData.rejectStatusId);

                if (validAgendaStatus != null)
                {
                    validStatusData.LeaveRequest.agenda_status_id = validAgendaStatus.agenda_status_id;

                    _emsContext.SaveChanges();
                }
            }

            _emsContext.SaveChanges();

            return agendaStatusData;
        }

    }
}
