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
    public class CheckingController : ControllerBase
    {
        private readonly ICheckingService _checkingservice;
        public CheckingController(ICheckingService checkingservice)
        {
            _checkingservice = checkingservice;
        }

        [HttpPost]
        [Route("saveChecking")]
        public IActionResult saveChecking([FromBody] CheckingTimeDataModel checkingdata)
        {
            var timeCheckingData = _checkingservice.saveChecking(checkingdata);

            return Ok(timeCheckingData);
        }

        [HttpGet]
        [Route("getAgendas")]
        public IActionResult getAgendas()
        {
            var modelData = _checkingservice.getAgendas();
            return Ok(modelData);
        }

        [HttpGet]
        [Route("getNotiAgenda")]
        public IActionResult getNotiAgenda()
        {
            var NotiAgendaData = _checkingservice.getNotiAgenda();
            return Ok(NotiAgendaData);
        }

        [HttpGet]
        [Route("getCheckinStatus")]
        public IActionResult getCheckinStatus()
        {
            var StstusData = _checkingservice.getCheckinStatus();
            return Ok(StstusData);
        }

        [HttpGet]
        [Route("getInvalidCheckTime")]
        public IActionResult getInvalidCheckTime()
        {
            var ValidData = _checkingservice.getInvalidCheckTime();
            return Ok(ValidData);
        }


    }
}
