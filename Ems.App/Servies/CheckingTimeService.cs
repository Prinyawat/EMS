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
        public CheckingTimeDataModel saveChecking(CheckingTimeDataModel checkingdata)
        {
            // ค้นหาข้อมูลสถานะ
            var validStatus = _emsContext.checking_status
                .FirstOrDefault(s => s.checking_status_name == checkingdata.status);

            // ถ้าพบสถานะที่ตรงกับค่าที่ส่งมา
            var checkingStatusId = validStatus.checking_status_id;

            // ค้นหาว่าผู้ใช้ได้เช็คอินแล้วแต่ยังไม่ได้เช็คเอาท์หรือไม่
            var existingCheckIn = _emsContext.check_in_out
                .FirstOrDefault(co => co.check_in != null && co.check_out == null && co.user_id == new Guid("571e4e36-f7b3-4418-832d-b9dd02d7842b"));

            // แปลงวันที่ให้เป็น UTC
            var utcCheckIn = checkingdata.checkin?.ToUniversalTime();
            var utcCheckOut = checkingdata.checkout?.ToUniversalTime();

            if (existingCheckIn != null && checkingdata.checkout.HasValue)
            {
                // กรณีที่มีข้อมูลเช็คอินอยู่แล้ว แต่ผู้ใช้ส่งค่า check_out มา
                existingCheckIn.check_out = utcCheckOut;  // อัปเดต check_out
                existingCheckIn.checking_status_id = checkingStatusId;  // อัปเดตสถานะ
                _emsContext.SaveChanges();  // บันทึกการเปลี่ยนแปลง
            }
            else if (existingCheckIn == null && checkingdata.checkin.HasValue)
            {
                // กรณีที่ยังไม่มีการเช็คอิน (ไม่พบข้อมูลที่ยังไม่ได้เช็คเอาท์)
                var newCheckInOut = new check_in_out
                {
                    check_inout_id = Guid.NewGuid(),
                    user_id = new Guid("571e4e36-f7b3-4418-832d-b9dd02d7842b"),
                    checking_status_id = checkingStatusId,
                    check_in = utcCheckIn,  // บันทึก check_in
                    check_out = utcCheckOut,  // บันทึก check_out
                    created_date = DateTime.Now  // บันทึกเวลาที่สร้างข้อมูล
                };

                _emsContext.check_in_out.Add(newCheckInOut);  // เพิ่มแถวใหม่
                _emsContext.SaveChanges();  // บันทึกการเปลี่ยนแปลง
            }

            // คืนค่า model ที่ได้รับการอัปเดต
            checkingdata.checkin = checkingdata.checkin;
            checkingdata.checkout = checkingdata.checkout;
            checkingdata.status = checkingdata.status;

            return checkingdata;
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
                    status = r.checking_status_name
                }).ToList();
        }

    }
}
