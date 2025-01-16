using Ems.App.Models;
using Ems.Data.Entities;

namespace Ems.App.Servies.IServices
{
    public interface ICourseService
    {
        List<CourseModel> GetCourses();
        RegistrationCourseModel RegisterCourse(RegistrationCourseModel model);
        void CancelRegistration(Guid userId, Guid courseId);


    }
}
