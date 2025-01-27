using System;
using Ems.App.Models;
using Ems.App.Servies;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Ems.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveRequestController : ControllerBase
    {
        private readonly ILeaveRequestService _leaverequestservice;
        public LeaveRequestController(ILeaveRequestService leaverequestservice)
        {
            _leaverequestservice = leaverequestservice;
        }

        [HttpPost]
        [Route("saveleaveRequest")]
        public IActionResult saveleaveRequest([FromBody] LeaveRequestModel leaveData)
        {
            var checkingData = _leaverequestservice.saveleaveRequest(leaveData);

            return Ok(new LeaveRequestModel(){
                startDate = leaveData.startDate,
                endDate = leaveData.endDate,
                status = leaveData.status
            });
        }

        [HttpPost]
        [Route("saveLeaveHalf")]
        public IActionResult saveLeaveHalf([FromBody] LeaveStatusModel leavestatusData)
        {
            var statusData = _leaverequestservice.saveLeaveHalf(leavestatusData);

            return Ok(new LeaveStatusModel()
            {
                halfStatus = leavestatusData.halfStatus
            });
        }
    }
}
