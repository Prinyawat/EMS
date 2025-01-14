using Ems.App.Models;
using Ems.App.Servies;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
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
        public IActionResult GetCourses()
        {
            var courses = _courseService.GetCourses();
            return Ok(courses.Select(c => new CourseModel
            {
                courseId = c.courseId,
                courseName = c.courseName,
                subtitle = c.subtitle,
                description = c.description,
                startDate = c.startDate,
                endDate = c.endDate,
                startTime = c.startTime,
                endTime = c.endTime
            }).ToList());
        }
    }
}
