using System;
using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
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
        public CheckingTimeDataModel saveChecking(CheckingTimeDataModel checkingdata)
        {
            var validStatus = _emsContext.checking_status
                .FirstOrDefault(s => s.checking_status_name == checkingdata.statuses);

            var checkingStatusId = validStatus.checking_status_id;

            var existingCheckIn = _emsContext.check_in_out
                .FirstOrDefault(co => co.check_in != null && co.check_out == null && co.user_id == new Guid("571e4e36-f7b3-4418-832d-b9dd02d7842b"));

            var utcCheckIn = checkingdata.checkin?.ToUniversalTime();
            var utcCheckOut = checkingdata.checkout?.ToUniversalTime();

            if (existingCheckIn != null && checkingdata.checkout.HasValue)
            {
                existingCheckIn.check_out = utcCheckOut;  
                existingCheckIn.checking_status_id = checkingStatusId;  
                _emsContext.SaveChanges(); 
            }
            else if (existingCheckIn == null && checkingdata.checkin.HasValue)
            {
                var newCheckInOut = new check_in_out
                {
                    check_inout_id = Guid.NewGuid(),
                    user_id = new Guid("571e4e36-f7b3-4418-832d-b9dd02d7842b"),
                    checking_status_id = checkingStatusId,
                    check_in = utcCheckIn,  
                    check_out = utcCheckOut,  
                    created_date = DateTime.Now  
                };

                _emsContext.check_in_out.Add(newCheckInOut);  
                _emsContext.SaveChanges(); 
            }

            checkingdata.checkin = checkingdata.checkin;
            checkingdata.checkout = checkingdata.checkout;
            checkingdata.statuses = checkingdata.statuses;

            return checkingdata;
        }

        public List<CheckingTimeDataModel> getInvalidCheckTime()
        {
            var userId = new Guid("571e4e36-f7b3-4418-832d-b9dd02d7842b");

            var today = DateTime.UtcNow.Date;

            // หาว่าวันนี้เช็คอินไปรึยัง
            var validCheckDate = _emsContext.check_in_out
            .Where(co => co.user_id == userId && co.check_dates.Value.ToUniversalTime().Date == today)
            .OrderByDescending(co => co.check_dates)
            .FirstOrDefault();

            // ถ้ายังไม่ได้เช็คอิน เข้าเงื่อนไข
            if (validCheckDate != null)
            {
                if (validCheckDate.check_out == null)
                {
                    return _emsContext.check_in_out
                    .Where(r => r.user_id == userId && r.check_in.HasValue)
                    .OrderByDescending(r => r.check_dates) // เรียงลำดับจากล่าสุด
                    .Join(
                        _emsContext.checking_status,
                        r => r.checking_status_id,
                        s => s.checking_status_id,
                        (r, s) => new CheckingTimeDataModel
                        {
                            checkin = r.check_in,
                            checkout = r.check_out,
                            statuses = s.checking_status_name
                        }
                    )
                    .ToList();
                }
                else
                {
                    return _emsContext.check_in_out
                    .Where(r => r.user_id == userId && r.check_in.HasValue && r.check_out.HasValue)
                    .OrderByDescending(r => r.check_dates)
                    .Join(
                        _emsContext.checking_status,
                        r => r.checking_status_id,
                        s => s.checking_status_id,
                        (r, s) => new CheckingTimeDataModel
                        {
                            checkin = r.check_in,
                            checkout = r.check_out,
                            statuses = s.checking_status_name
                        }
                    )
                    .ToList();
                }
            }
            else
            {
                return new List<CheckingTimeDataModel>();
            }
        }


        public List<AgendaModel> getAgendas()
        {
            var userId1 = new Guid("571e4e36-f7b3-4418-832d-b9dd02d7842b");
            var userId2 = new Guid("289a03f8-182f-46ad-b885-2a6de22bbca8");

            return _emsContext.check_in_out
                .Where(r => r.user_id == userId1 || r.user_id == userId2)
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

        public List<CheckingStatusModel> getCheckinStatus()
        {

            return _emsContext.checking_status
                .Select(r => new CheckingStatusModel
                {
                    statuses = r.checking_status_name

                }).ToList();
        }

    }
}
