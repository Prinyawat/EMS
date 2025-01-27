using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
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

        public LeaveRequestModel saveleaveRequest(LeaveRequestModel leaveData)
        {
            DateTime startDate = DateTime.Parse(leaveData.startDate);
            DateTime endDate = DateTime.Parse(leaveData.endDate);

            string startDateString = startDate.ToString("dd/MM/yyyy");
            string endDateString = endDate.ToString("dd/MM/yyyy");

            string dateRange = $"{startDateString} - {endDateString}";

            var checkingStatusData = _emsContext.leave_request_status
                    .Where(s => s.leave_request_status_name == leaveData.status)
                    .ToList();

            if (checkingStatusData.Any()) 
            {
                foreach (var statusData in checkingStatusData) 
                {
                    var newleaveRequest = new leave_request
                    {
                        user_id = new Guid("571e4e36-f7b3-4418-832d-b9dd02d7842b"),
                        leave_request_status_id = statusData.leave_request_status_id,
                        leave_request_date = dateRange, 
                        status_name = statusData.leave_request_status_name
                    };

                    _emsContext.leave_request.Add(newleaveRequest); 
                }

                _emsContext.SaveChanges();

                leaveData.startDate = startDate.ToString("dd/MM/yyyy");
                leaveData.endDate = endDate.ToString("dd/MM/yyyy");
                leaveData.status = leaveData.status; 
            }

            return leaveData;
        }

        public LeaveStatusModel saveLeaveHalf(LeaveStatusModel leavestatusData)
        {
            var leaveHalf = _emsContext.leave_half
                .Where(s => s.leave_type_name == leavestatusData.halfStatus)
                .FirstOrDefault();

            if (leaveHalf == null)
            {
                return leavestatusData;
            }

            var leaveRequests = _emsContext.leave_request
                .Where(lr => lr.leave_half_id == null)
                .ToList();

            foreach (var leaveRequest in leaveRequests)
            {
                leaveRequest.leave_half_id = leaveHalf.leave_half_id;
            }
            _emsContext.SaveChanges();

            return leavestatusData;
        }


    }
}
