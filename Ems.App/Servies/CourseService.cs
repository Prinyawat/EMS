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
            return _emsContext.course.Select(c => new CourseModel
            {
                courseId = c.course_id,
                courseName = c.course_name,
                subtitle = c.subtitle,
                description = c.description,
                startDate = c.start_date,
                endDate = c.end_date,
                startTime = c.start_time,
                endTime = c.end_time
            }).ToList();
        }

    }
}
