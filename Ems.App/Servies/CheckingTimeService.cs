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
            // เช็คสถานะการเช็คอิน
            var validStatus = _emsContext.checking_status.FirstOrDefault(s => s.checking_status_name == data.status);
            if (validStatus == null)
            {
                throw new Exception("Invalid status provided.");
            }

            var checkingStatusId = validStatus.checking_status_id;

            // ตรวจสอบการเช็คเอาต์ก่อนหน้านี้
            var validCheckOut = _emsContext.check_in_out
                .FirstOrDefault(co => co.check_out == null && co.user_id == new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad"));

            // ถ้าไม่มีการเช็คเอาต์ให้เพิ่มแถวใหม่สำหรับการเช็คอิน
            var newCheckInOut = new check_in_out
            {
                check_inout_id = Guid.NewGuid(),
                user_id = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad"),
                checking_status_id = checkingStatusId,
                check_in = DateTime.Now, // เวลาที่เช็คอิน
                created_by = "system", // ผู้สร้าง
                created_date = DateTime.Now // วันที่สร้าง
            };

            // หากมีการเช็คเอาต์แล้ว (มีค่า check_out)
            if (validCheckOut != null)
            {
                newCheckInOut.check_out = DateTime.Now; // กำหนดเวลาเช็คเอาต์
            }

            // เพิ่มแถวใหม่เข้าฐานข้อมูล
            _emsContext.check_in_out.Add(newCheckInOut);
            _emsContext.SaveChanges();

            // ดึงเวลาเช็คอินล่าสุดจากฐานข้อมูล
            List<DateTime> datetimes = _emsContext.check_in_out
                .Where(x => x.check_in.HasValue)
                .Select(x => x.check_in.Value)
                .ToList();

            data.timeStamp = datetimes.LastOrDefault(); // ส่งค่า timeStamp กลับ

            return data;
        }

    }

}
