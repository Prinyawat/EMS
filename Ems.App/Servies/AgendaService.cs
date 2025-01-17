using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Ems.App.Servies
{
    public class AgendaService : IAgendaService
    {
        private readonly EmsContext _emsContext;

        public AgendaService(EmsContext emsContext)
        {
            _emsContext = emsContext;
        }
        public List<string> getAgendas()
        {
            var result = from users in _emsContext.user_agenda
                         join checkInOut in _emsContext.check_in_out
                         on users.check_inout_id equals checkInOut.check_inout_id
                         select new
                         {
                             users.check_inout_id,
                         };
            List<user_agenda> agendasToAdd = new List<user_agenda>();

            foreach (var item in result)
            {
                user_agenda agendaData = new user_agenda()
                {
                    user_id = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad"),
                    check_inout_id = item.check_inout_id, 
                };

                agendasToAdd.Add(agendaData);
            }

            _emsContext.user_agenda.AddRange(agendasToAdd);
            _emsContext.SaveChanges();

            List<string> agendaNames = _emsContext.user_agenda
                                                   .Select(x => x.check_inout_id.ToString())
                                                   .ToList();
            return agendaNames;
        }
    }
}
