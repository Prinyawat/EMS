using Ems.App.Entities;
using Ems.App.Servies;
using Ems.App.Servies.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ems.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet]
        [Route("getCourses")]
        public List<Course> GetCourses()
        {
            return _courseService.GetCourses();
        }
    }
}
