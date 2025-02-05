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
    }
}
