using System.IO;
using System.Linq;
using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Ems.App.Servies
{
    public class LeaveRequestService : ILeaveRequestService
    {
        private readonly EmsContext _emsContext;

        public LeaveRequestService(EmsContext emsContext)
        {
            _emsContext = emsContext;
        }

        public void saveleaveRequest(LeaveRequestModel formData)
        {
   
            var leaveRequestEntities = new List<leave_request>();
            var userId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad");

            var leaveRequestEntity = new leave_request
            {
                user_id = userId,
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
        }

        //public List<LeaveRequestModel> getLeaveRequestNoti()
        //{
        //    var leaveRequests = _emsContext.leave_request
        //        .Select(lr => new
        //        {
        //            leave_request_date = lr.leave_request_date,
        //            status = lr.status_name
        //        })
        //        .ToList();

        //    List<LeaveRequestModel> notifications = new List<LeaveRequestModel>();

        //    foreach (var leaveRequest in leaveRequests)
        //    {
        //        var dateRange = leaveRequest.leave_request_date?.Split(" - ");

        //        if (dateRange != null && dateRange.Length == 2)
        //        {
        //            notifications.Add(new LeaveRequestModel
        //            {
        //                startDate = dateRange[0].Trim(),
        //                endDate = dateRange[1].Trim(),
        //                status = leaveRequest.status
        //            });
        //        }
        //    }

        //    return notifications;
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
    }
}
