using System;
using Ems.App.Models;
using Ems.App.Servies;
using Ems.App.Servies.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Ems.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgendaController : ControllerBase
    {
        private readonly IAgendaService _agendaservice;
        public AgendaController(IAgendaService agendaservice)
        {
            _agendaservice = agendaservice;
        }

        [HttpGet]
        [Route("getAgendas")]
        public List<string> getagendas()
        {
            return _agendaservice.getAgendas();
        }
    }
}
