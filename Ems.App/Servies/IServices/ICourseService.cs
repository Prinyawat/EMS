using Ems.App.Models;
using Ems.Data.Entities;

namespace Ems.App.Servies.IServices
{
    public interface ICourseService
    {
        List<CourseModel> GetCourses();
        List<CourseModel> GetRegisteredCourses();
        List<CourseModel>GetCompletedCourses();
       CourseModel GetCourseById(Guid courseId);
        RegistrationCourseModel RegisterCourse(RegistrationCourseModel model);
        void CancelRegistration(Guid userId, Guid courseId);
        void RecordProgress(Guid userId, Guid courseId, Guid chapterId, Guid contentId);
        void SaveUserAnswers(List<UserQuestionModel> answers);
        UserResultModel CalculateUserResult(Guid userId, Guid courseId);

    }
}
