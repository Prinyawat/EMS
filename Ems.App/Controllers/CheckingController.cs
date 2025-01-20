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
        public IActionResult saveChecking(CheckingModel data)
        {
            var checkingData = _checkingservice.saveChecking(data);

            return Ok(new CheckingModel(){
                timeStamp = data.timeStamp,
                status = data.status
            });
        }

        [HttpGet]
        [Route("getAgendas")]
        public IActionResult getAgendas()
        {
            var modelData = _checkingservice.getAgendas();
            return Ok(modelData);
        }
    }
}
