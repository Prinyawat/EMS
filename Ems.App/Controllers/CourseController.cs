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
                endTime = c.endTime,
                statusName = c.statusName
            }).ToList());
        }

        [HttpPost]
        [Route("registerCourse")]
        public IActionResult RegisterCourse([FromBody] RegistrationCourseModel model)
        {
            model.userId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad");
            var result = _courseService.RegisterCourse(model);
            return Ok(result);
        }

        //[HttpDelete]
        //[Route("cancel/{courseId}")]
        //public IActionResult CancelRegistration(Guid courseId)
        //{
        //    var userId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad");
        //    var result = _courseService.CancelRegistration(userId, courseId);
        //    if (result)
        //    {
        //        return Ok(new { message = "ยกเลิกการลงทะเบียนสำเร็จ" });
        //    }
        //    return NotFound(new { message = "ไม่พบข้อมูลการลงทะเบียน" });
        //}


    }
}
