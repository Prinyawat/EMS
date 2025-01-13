using Ems.App.Entities;
using Ems.App.Servies.IServices;
using Microsoft.EntityFrameworkCore;

namespace Ems.App.Servies
{
    public class CourseService : ICourseService
    {
        private readonly EmsContext _emsContext;

        public CourseService(EmsContext emsContext)
        {
            _emsContext = emsContext;
        }

        public List<Course> GetCourses()
        {
            return _emsContext.Courses.ToList();
        }
    }
}
