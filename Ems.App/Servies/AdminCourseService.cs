using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Ems.App.Servies
{
    public class AdminCourseService : IAdminCourseService
    {
        private readonly EmsContext _emsContext;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IIdentityService _identityService;

        public AdminCourseService(EmsContext emsContext, IHubContext<NotificationHub> hubContext, IIdentityService identityService)
        {
            _emsContext = emsContext;
            _hubContext = hubContext;
            _identityService = identityService;
        }
        public AdminCourseModel AddCourse(AdminCourseModel model)
        {
            if (model == null)
            {
                throw new ArgumentException("ข้อมูลคอร์สไม่ถูกต้อง");
            }

            var currentUser = _identityService.GetCurrentUser();

            var newCourse = new course
            {
                course_id = Guid.NewGuid(),
                course_name = model.courseName,
                subtitle = model.subtitle,
                description = model.description,
                start_date = model.startDate,
                end_date = model.endDate,
                start_time = model.startTime,
                end_time = model.endTime,
                created_by = currentUser.ToString()
            };

            _emsContext.course.Add(newCourse);
            _emsContext.SaveChanges();

            return new AdminCourseModel
            {
                courseId = newCourse.course_id,
                courseName = newCourse.course_name,
                subtitle = newCourse.subtitle,
                description = newCourse.description,
                startDate = newCourse.start_date,
                endDate = newCourse.end_date,
                startTime = newCourse.start_time,
                endTime = newCourse.end_time
            };
        }

        public bool DeleteCourse(Guid courseId)
        {
            var courseToDelete = _emsContext.course.FirstOrDefault(c => c.course_id == courseId);
            if (courseToDelete == null)
            {
                return false;
            }

            _emsContext.course.Remove(courseToDelete);
            _emsContext.SaveChanges();
            return true;
        }

        public AdminCourseModel UpdateCourse(AdminCourseModel updatedCourse)
        {
            if (updatedCourse == null || updatedCourse.courseId == Guid.Empty)
            {
                throw new ArgumentException("ข้อมูลคอร์สไม่ถูกต้อง");
            }

            var existingCourse = _emsContext.course.FirstOrDefault(c => c.course_id == updatedCourse.courseId);
            if (existingCourse == null)
            {
                throw new KeyNotFoundException("ไม่พบคอร์สที่ต้องการอัปเดต");
            }

            var currentUser = _identityService.GetCurrentUser();

            existingCourse.course_name = updatedCourse.courseName;
            existingCourse.subtitle = updatedCourse.subtitle;
            existingCourse.description = updatedCourse.description;
            existingCourse.start_date = updatedCourse.startDate;
            existingCourse.end_date = updatedCourse.endDate;
            existingCourse.start_time = updatedCourse.startTime;
            existingCourse.end_time = updatedCourse.endTime;
            existingCourse.updated_by = currentUser.ToString(); 

            _emsContext.SaveChanges();

            return new AdminCourseModel
            {
                courseId = existingCourse.course_id,
                courseName = existingCourse.course_name,
                subtitle = existingCourse.subtitle,
                description = existingCourse.description,
                startDate = existingCourse.start_date,
                endDate = existingCourse.end_date,
                startTime = existingCourse.start_time,
                endTime = existingCourse.end_time
            };
        }

    }

}

