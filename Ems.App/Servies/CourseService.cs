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

        public List<course> GetCourses()
        {
            return _emsContext.course.ToList();
        }
    }
}
