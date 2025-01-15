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
            var validStatus = _emsContext.checking_status.FirstOrDefault(s => s.checking_status_name == data.status);
            if (validStatus == null)
            {
                throw new Exception("Invalid status provided.");
            }

            var checkingStatusId = validStatus.checking_status_id;
            var relatedCheckInOut = _emsContext.check_in_out
            .Where(co => co.checking_status_id == checkingStatusId)
            .ToList();

            var validCheckOut = _emsContext.check_in_out
    .FirstOrDefault(co => co.check_out == null && co.user_id == new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad"));

            if (validCheckOut == null)
            {
                var newCheckInOut = new check_in_out
                {
                    check_inout_id = Guid.NewGuid(), // กำหนด ID ใหม่
                    user_id = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad"), // กำหนด user_id
                    checking_status_id = checkingStatusId, // กำหนด checking_status_id
                    check_in = DateTime.Now, // กำหนดเวลาที่เช็คอิน
                    created_by = "system", // กำหนดผู้ที่สร้างรายการ
                    created_date = DateTime.Now // กำหนดวันที่สร้างรายการ
                };

                _emsContext.check_in_out.Add(newCheckInOut);
                _emsContext.SaveChanges(); 
            }
            else
            {
                validCheckOut.check_out = DateTime.Now; // กำหนดเวลาเช็คเอาต์
                _emsContext.SaveChanges(); // บันทึกการเปลี่ยนแปลง
            }


            List<DateTime> datetimes = _emsContext.check_in_out
                                              .Where(x => x.check_in.HasValue)
                                              .Select(x => x.check_in.Value)
                                              .ToList();
            data.timeStamp = datetimes.LastOrDefault();

            return data;
        }
    }

}
