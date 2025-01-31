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
        public IActionResult saveleaveRequest([FromBody] LeaveRequestModel formData)
        {
            formData.UserId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad");
            var result = _leaverequestservice.saveleaveRequest(formData);
            //_leaverequestservice.saveleaveRequest(leaveData);

            return Ok(result);
        }

        [HttpGet]
        [Route("getLeaveRequestHalfStatus")]
        public IActionResult getLeaveRequestHalfStatus()
        {
            var statusData = _leaverequestservice.getLeaveRequestHalfStatus();
            return Ok(statusData);
        }

        //[HttpGet]
        //[Route("getLeaveRequestNoti")]
        //public ActionResult<List<LeaveRequestModel>> getLeaveRequestNoti()
        //{
        //    var leaveRequestChoice = _leaverequestservice.getLeaveRequestNoti();
        //    return Ok(leaveRequestChoice);
        //}

        [HttpGet]
        [Route("getLeaveRequestStatus")]
        public IActionResult getLeaveRequestStatus()
        {
            var leaveData = _leaverequestservice.getLeaveRequestStatus();
            return Ok(leaveData);
        }
    }
}
