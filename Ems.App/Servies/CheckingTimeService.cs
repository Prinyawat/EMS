using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Ems.App.Servies
{
    public class CheckingTimeService : ICheckingService
    {
        private readonly EmsContext _emsContext;

        public CheckingTimeService(EmsContext emsContext)
        {
            _emsContext = emsContext;
        }
        public CheckingModel saveChecking(CheckingModel data)
        {
            var validStatus = _emsContext.checking_status
                .FirstOrDefault(s => s.checking_status_name == data.status);

            if (validStatus == null)
            {
                throw new Exception("Invalid status provided.");
            }

            var checkingStatusId = validStatus.checking_status_id;
            var existingCheckIn = _emsContext.check_in_out
                .FirstOrDefault(co => co.check_in != null && co.check_out == null && co.user_id == new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad"));

            if (existingCheckIn == null)
            {
                var newCheckInOut = new check_in_out
                {
                    check_inout_id = Guid.NewGuid(),
                    user_id = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad"),
                    checking_status_id = checkingStatusId,
                    check_in = DateTime.Now,
                    created_date = DateTime.Now
                };

                _emsContext.check_in_out.Add(newCheckInOut);
                _emsContext.SaveChanges();

                data.timeStamp = newCheckInOut.check_in.Value;
                data.status = data.status;
            }
            else
            {
                existingCheckIn.check_out = DateTime.Now; 
                _emsContext.SaveChanges();

                data.timeStamp = existingCheckIn.check_out.Value;
                data.status = data.status;
            }

            return data;
        }

        public List<AgendaModel> getAgendas()
        {
            var userId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad");

            return _emsContext.check_in_out
                .Where(r => r.user_id == userId)
                .Select(r => new AgendaModel
                {
                    firstName = r.user.first_name,
                    lastName = r.user.last_name,
                    checkingDate = r.check_dates,
                    checkIn = r.check_in,
                    checkOut = r.check_out,
                    checkingStatus = r.checking_status.checking_status_name

                }).ToList();
        }

    }
}
