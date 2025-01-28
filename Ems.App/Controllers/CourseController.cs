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

        [HttpGet]
        [Route("getRegisteredCourses")]
        public IActionResult GetRegisteredCourses()
        {
            var registercourse = _courseService.GetRegisteredCourses();
            return Ok(registercourse);
        }

        [HttpGet]
        [Route("getCompletedCourses")]
        public IActionResult GetCompletedCourses()
        {
            var completedcourse = _courseService.GetCompletedCourses();
            return Ok(completedcourse);
        }

        [HttpGet]
        [Route("getCourseById/{courseId}")]
        public IActionResult GetCourseById(Guid courseId)
        {
            var coursebyid = _courseService.GetCourseById(courseId);
            return Ok(coursebyid);
        }

        [HttpPost]
        [Route("registerCourse")]
        public IActionResult RegisterCourse([FromBody] RegistrationCourseModel model)
        {
            model.userId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad");
            var result = _courseService.RegisterCourse(model);
            return Ok(result);
        }

        [HttpDelete]
        [Route("cancelRegistration/{courseId}")]
        public IActionResult CancelRegistration(Guid courseId)
        {
            var userId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad"); 
            _courseService.CancelRegistration(userId, courseId);
            return Ok(new { message = "ยกเลิกลงทะเบียนเสร็จสิ้น." });
        }

        [HttpPost]
        [Route("recordProgress")]
        public IActionResult RecordProgress([FromBody] RecordProgressModel model)
        {
         
                var userId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad"); 
                _courseService.RecordProgress(userId, model.courseId, model.chapterId, model.contentId);
                return Ok(new { message = "บันทึกความคืบหน้าเรียบร้อยแล้ว." });
        
        }

        [HttpPost]
        [Route("saveAnswers")]
        public IActionResult SaveUserAnswers([FromBody] List<UserQuestionModel> answers)
        {
            var userId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad");

            foreach (var answer in answers)
            {
                answer.userId = userId;
            }

            _courseService.SaveUserAnswers(answers);
            var courseId = answers.First().courseId;
            var result = _courseService.CalculateUserResult(userId, courseId);
            return Ok(result);
        }


        [HttpGet]
        [Route("calculateResult/{courseId}")]
        public IActionResult CalculateUserResult(Guid courseId)
        {
            var userId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad");
            var result = _courseService.CalculateUserResult(userId, courseId);
            return Ok(result);
        }
    }
}
