using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;

namespace Ems.App.Servies
{
    public class CourseService : ICourseService
    {
        private readonly EmsContext _emsContext;

        public CourseService(EmsContext emsContext)
        {
            _emsContext = emsContext;
        }

        public List<CourseModel> GetCourses()
        {
            var userId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad"); 
            return _emsContext.course.Select(c => new CourseModel
            {
                courseId = c.course_id,
                courseName = c.course_name,
                subtitle = c.subtitle,
                description = c.description,
                startDate = c.start_date,
                endDate = c.end_date,
                startTime = c.start_time,
                endTime = c.end_time,
                statusName = _emsContext.registration
                    .Where(r => r.course_id == c.course_id && r.user_id == userId)
                    .Select(r => r.status.status_name)
                    .SingleOrDefault() ?? ""
            }).ToList();
        }

        public CourseModel GetCourseById(Guid courseId)
        {
            var course = _emsContext.course
                .Where(c => c.course_id == courseId)
                .Select(c => new CourseModel
                {
                    courseId = c.course_id,
                    courseName = c.course_name,
                    subtitle = c.subtitle,
                    description = c.description,
                    startDate = c.start_date,
                    endDate = c.end_date,
                    startTime = c.start_time,
                    endTime = c.end_time,
                    statusName = "",
                    chapters = c.chapter.Select(ch => new ChapterModel
                    {
                        chapterId = ch.chapter_id,
                        title = ch.chapter_title,
                        contents = ch.chapter_content.Select(ct => new ContentModel
                        {
                            contentId = ct.content_id,
                            contentTitle = ct.content_title,
                            body = ct.content_body
                        }).ToList()
                    }).ToList()
                }).FirstOrDefault();

            return course;
        }

        public List<CourseModel> GetRegisteredCourses()
        {
            var userId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad"); 
            return _emsContext.registration
                .Where(r => r.user_id == userId && r.status.status_name == "ลงทะเบียนแล้ว")
                .Select(r => new CourseModel
                {
                    courseId = r.course_id,
                    courseName = r.course.course_name,
                    subtitle = r.course.subtitle,
                    description = r.course.description,
                    startDate = r.course.start_date,
                    endDate = r.course.end_date,
                    startTime = r.course.start_time,
                    endTime = r.course.end_time,
                    statusName = r.status.status_name
                }).ToList();
        }

        public RegistrationCourseModel RegisterCourse(RegistrationCourseModel model)
        {
            var registeredStatus = _emsContext.status
                .FirstOrDefault(s => s.status_name == "ลงทะเบียนแล้ว");

            var registration = new registration
            {
                registration_id = Guid.NewGuid(),
                user_id = model.userId,
                course_id = model.courseId,
                status_id = registeredStatus.status_id
            };

            _emsContext.registration.Add(registration);
            _emsContext.SaveChanges();

            return new RegistrationCourseModel
            {
                registrationId = registration.registration_id,
                userId = registration.user_id,
                courseId = registration.course_id,
                statusId = registration.status_id
            };
        }

        public void CancelRegistration(Guid userId, Guid courseId)
        {
            var registration = _emsContext.registration
                .FirstOrDefault(r => r.user_id == userId && r.course_id == courseId);

            if (registration != null)
            {
                _emsContext.registration.Remove(registration);
                _emsContext.SaveChanges();
            }
        }

    }
}
