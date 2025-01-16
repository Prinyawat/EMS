using System;
using Ems.App.Models;
using Ems.App.Servies.IServices;
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
    }
}
