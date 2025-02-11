using Ems.App.Models;
using Ems.App.Servies;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Ems.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminCourseController : ControllerBase
    {
        private readonly IAdminCourseService _admincourseService;
        private readonly IIdentityService _identityService;
        public AdminCourseController(IAdminCourseService admincourseService, IIdentityService identityService)
        {
            _admincourseService = admincourseService;
            _identityService = identityService;
        }


        [HttpPost]
        [Route("addCourse")]
        public IActionResult AddCourse([FromBody] AdminCourseModel model)
        {
            var newCourse = _admincourseService.AddCourse(model);
            return Ok(newCourse);
        }

        [HttpDelete]
        [Route("deleteCourse/{courseId}")]
        public IActionResult DeleteCourse(Guid courseId)
        {
            var isDeleted = _admincourseService.DeleteCourse(courseId);
            if (!isDeleted)
            {
                return NotFound(new { message = "ไม่พบคอร์สที่ต้องการลบ" });
            }
            return Ok(new { message = "ลบคอร์สสำเร็จ" });
        }

        [HttpPut]
        [Route("updateCourse")]
        public IActionResult UpdateCourse([FromBody] AdminCourseModel updatedCourse)
        {

            var update = _admincourseService.UpdateCourse(updatedCourse);
            return Ok(update);

        }

        [HttpPost]
        [Route("addChapter")]
        public IActionResult AddChapter([FromBody] AdminChapterModel model)
        {
            var newChapter = _admincourseService.AddChapter(model);
            return Ok(newChapter);
        }

        [HttpPut]
        [Route("updateChapter")]
        public IActionResult UpdateChapter([FromBody] AdminChapterModel updatedChapter)
        {
            var updated = _admincourseService.UpdateChapter(updatedChapter);
            return Ok(updated);
        }

        [HttpDelete]
        [Route("deleteChapter/{chapterId}")]
        public IActionResult DeleteChapter(Guid chapterId)
        {
            var isDeleted = _admincourseService.DeleteChapter(chapterId);
            if (!isDeleted)
            {
                return NotFound(new { message = "ไม่พบบทเรียนที่ต้องการลบ" });
            }
            return Ok(new { message = "ลบบทเรียนสำเร็จ" });
        }

        [HttpPost]
        [Route("addContent")]
        public IActionResult AddContent([FromBody] AdminChapterContentModel model)
        {
            var newContent = _admincourseService.AddContent(model);
            return Ok(newContent);
        }

        [HttpPut]
        [Route("updateContent")]
        public IActionResult UpdateContent([FromBody] AdminChapterContentModel updatedContent)
        {
            var updated = _admincourseService.UpdateContent(updatedContent);
            return Ok(updated);
        }

        [HttpDelete]
        [Route("deleteContent/{contentId}")]
        public IActionResult DeteleContent(Guid contentId)
        {
            var isDeleted = _admincourseService.DeleteContent(contentId);
            if (!isDeleted)
            {
                return NotFound(new { message = "ไม่พบหัวข้อที่ต้องการลบ" });
            }
            return Ok(new { message = "ลบหัวข้อสำเร็จ" });
        }

        [HttpPost]
        [Route("addQuestion")]
        public IActionResult AddQuestion([FromBody] AdminQuestionModel model)
        {
            var newQuestion = _admincourseService.AddQuestion(model);
            return Ok(newQuestion);
        }

        [HttpPut]
        [Route("updateQuestion")]
        public IActionResult UpdateQuestion([FromBody] AdminQuestionModel updateQuestion)
        {
            var updated = _admincourseService.UpdateQuestion(updateQuestion);
            return Ok(updated);
        }

        [HttpDelete]
        [Route("deleteQuestion/{questionId}")]
        public IActionResult DeleteQuestion(Guid questionId)
        {
            var isDeleted = _admincourseService.DeleteQuestion(questionId);
            if (!isDeleted)
            {
                return NotFound(new { message = "ไม่พบคำถามที่ต้องการลบ" });
            }
            return Ok(new { message = "ลบคำถามสำเร็จ" });
        }

        [HttpPost]
        [Route("addOption")]
        public IActionResult AddOption([FromBody] AdminOptinModel model)
        {
            var newOption = _admincourseService.AddOption(model);
            return Ok(newOption);
        }

        [HttpPut]
        [Route("updateOption")]
        public IActionResult UpdateOption([FromBody] AdminOptinModel updateOption)
        {
            var updated = _admincourseService.UpdateOption(updateOption);
            return Ok(updated);
        }

        [HttpDelete]
        [Route("deleteOption/{optionId}")]
        public IActionResult DeleteOption(Guid optionId)
        {
            var isDeleted = _admincourseService.DeleteOption(optionId);
            if (!isDeleted)
            {
                return NotFound(new { message = "ไม่พบตัวเลือกที่ต้องการลบ" });
            }
            return Ok(new { message = "ลบตัวเลือกสำเร็จ" });
        }
    }
}
