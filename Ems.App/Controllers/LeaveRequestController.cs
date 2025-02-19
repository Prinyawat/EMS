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
        private readonly IIdentityService _identityService;
        public LeaveRequestController(ILeaveRequestService leaverequestservice, IIdentityService identityService)
        {
            _leaverequestservice = leaverequestservice;
            _identityService = identityService;
        }

        [HttpPost]
        [Route("saveleaveRequest")]
        public IActionResult saveleaveRequest([FromBody] LeaveRequestModel formData)
        {
            try
            {
                formData.UserId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad");
                var result = _leaverequestservice.saveleaveRequest(formData);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
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

        [HttpDelete]
        [Route("deleteLeaveRequest/{leaveRequestID}")]
        public IActionResult deleteLeaveRequest(Guid leaveRequestID)
        {
            var isDeleted = _leaverequestservice.deleteLeaveRequest(leaveRequestID);
            return Ok(new { message = "ปฏิเสธคำขอเสร็จสิ้น" });
        }

        [HttpPost]
        [Route("saveAgendaApprove")]
        public IActionResult saveAgendaApprove([FromBody] approveStatusModel agendaStatusData)
        {
            var result = _leaverequestservice.saveAgendaApprove(agendaStatusData);
            return Ok(result);
        }
       
        [HttpPost]
        [Route("saveAgendaReject")]
        public IActionResult saveAgendaReject([FromBody] rejectStatusModel agendaStatusData)
        {
            var result = _leaverequestservice.saveAgendaReject(agendaStatusData);
            return Ok(result);
        }

        [HttpPost]
        [Route("saveAgendaUpdate")]
        public IActionResult saveAgendaUpdate([FromBody] updateStatusModel agendaStatusData)
        {
            var result = _leaverequestservice.saveAgendaUpdate(agendaStatusData);
            return Ok(result);
        }
    }
}
