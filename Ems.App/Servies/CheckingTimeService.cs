using System;
using System.Globalization;
using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Ems.App.Servies
{
    public class CheckingTimeService : ICheckingService
    {
        private readonly EmsContext _emsContext;
        private readonly IIdentityService _identityService;

        public CheckingTimeService(EmsContext emsContext, IIdentityService identityService)
        {
            _emsContext = emsContext;
            _identityService = identityService;
        }
        public CheckingTimeDataModel saveChecking(CheckingTimeDataModel checkingdata)
        {
            Guid userId = this._identityService.GetCurrentUser();

            var validStatus = _emsContext.checking_status
                .FirstOrDefault(s => s.checking_status_name == checkingdata.statuses);

            var checkingStatusId = validStatus.checking_status_id;

            var existingCheckIn = _emsContext.check_in_out
                .FirstOrDefault(co => co.check_in != null && co.check_out == null && co.user_id == userId);

            var utcCheckIn = DateTime.TryParse(checkingdata.checkin, out var checkInTime)
                             ? checkInTime.ToString("hh:mm:ss tt", CultureInfo.InvariantCulture)
                             : string.Empty;
            var utcCheckOut = DateTime.TryParse(checkingdata.checkout, out var checkOutTime)
                             ? checkOutTime.ToString("hh:mm:ss tt", CultureInfo.InvariantCulture)
                             : null;

            if (existingCheckIn != null)
            {
                existingCheckIn.check_out = utcCheckOut;  
                existingCheckIn.checking_status_id = checkingStatusId;  
                _emsContext.SaveChanges(); 
            }
            else if (existingCheckIn == null && !string.IsNullOrWhiteSpace(checkingdata.checkin))
            {
                var newCheckInOut = new check_in_out
                {
                    check_inout_id = Guid.NewGuid(),
                    user_id = this._identityService.GetCurrentUser(),
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
            Guid userId = this._identityService.GetCurrentUser();

            var today = DateTime.UtcNow.Date;

            var validCheckDate = _emsContext.check_in_out
            .Where(co => co.user_id == userId && co.check_dates.Value.ToUniversalTime().Date == today)
            .OrderByDescending(co => co.check_dates)
            .FirstOrDefault();

            if (validCheckDate != null)
            {
                if (validCheckDate.check_out == null)
                {
                    return _emsContext.check_in_out
                    .Where(r => r.user_id == userId && !string.IsNullOrWhiteSpace(r.check_in))
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
                else
                {
                    return _emsContext.check_in_out
                    .Where(r => r.user_id == userId && !string.IsNullOrWhiteSpace(r.check_in) && !string.IsNullOrWhiteSpace(r.check_out))
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
            Guid userId1 = this._identityService.GetCurrentUser();

            return _emsContext.check_in_out
                .Where(r => r.user_id == userId1)
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

        public List<NotiAgendaModel> getNotiAgenda()
        {
            Guid pending = new Guid("56c99f7b-ada2-4c63-a949-2165c708d9ea");
            Guid userId = this._identityService.GetCurrentUser();

            if (userId.ToString() == "42cfb3be-fa01-499a-95af-fa0a879fb0ad")
            {
                var result = _emsContext.user
                .AsNoTracking()  
                .Join(
                    _emsContext.leave_request,
                    u => u.user_id,
                    lr => lr.user_id,
                    (u, lr) => new { u, lr }
                )
                .Join(
                    _emsContext.leave_half,
                    ulr => ulr.lr.leave_half_id,
                    lh => lh.leave_half_id,
                    (ulr, lh) => new { ulr, lh }
                )
                .Where(x => x.ulr.lr.agenda_status_id == pending)
                .Select(x => new NotiAgendaModel
                {
                    leaveRequestID = x.ulr.lr.leave_request_id,
                    UserID = userId,
                    firstName = x.ulr.u.first_name,
                    lastName = x.ulr.u.last_name,
                    selectedLeaveHalfStatus = x.lh.leave_type_name,
                    leaveStatus = x.ulr.lr.status_name,
                    checkingDate = x.ulr.lr.leave_request_date,
                    startTime = x.ulr.lr.leave_start_time,
                    endTime = x.ulr.lr.leave_end_time,
                    additionalDescription = x.ulr.lr.leave_request_description
                })
                .ToList();
                return result;
            }
            else
            {
                return _emsContext.user
                    .Where(u => u.user_id == userId)
                    .Join(
                        _emsContext.leave_request,
                        u => u.user_id,
                        lr => lr.user_id,
                        (u, lr) => new { u, lr }
                    )
                    .Join(
                        _emsContext.leave_half,
                        ulr => ulr.lr.leave_half_id,
                        lh => lh.leave_half_id,
                        (ulr, lh) => new NotiAgendaModel
                        {
                            agendaStatusId = ulr.lr.agenda_status_id.Value,
                            UserID = userId,
                            firstName = ulr.u.first_name,
                            lastName = ulr.u.last_name,
                            selectedLeaveHalfStatus = lh.leave_type_name,
                            leaveStatus = ulr.lr.status_name,
                            checkingDate = ulr.lr.leave_request_date,
                            startTime = ulr.lr.leave_start_time,
                            endTime = ulr.lr.leave_end_time,
                            additionalDescription = ulr.lr.leave_request_description
                        }
                    )
                    .ToList();
            }
        }

        public List<CheckingStatusModel> getCheckinStatus()
        {
            return _emsContext.checking_status
                .Select(r => new CheckingStatusModel
                {
                    statuses = r.checking_status_name

                }).ToList();
        }

        public List<HeaderAgendaModel> getAgendaHeader()
        {
            return _emsContext.user
                .Select(r => new HeaderAgendaModel
                {
                    firstName = r.first_name,
                    lastName = r.last_name

                }).ToList();
        }


    }
}
