using Ems.App.Models;
using Ems.Data.Entities;

namespace Ems.App.Servies.IServices
{
    public interface IAdminCourseService
    {
        //Course
        AdminCourseModel AddCourse(AdminCourseModel model);
        AdminCourseModel UpdateCourse(AdminCourseModel updatedCourse);
        bool DeleteCourse(Guid courseId);

        //Chapter/Content
        AdminChapterModel AddChapter(AdminChapterModel model);
        AdminChapterModel UpdateChapter(AdminChapterModel updatedChapter);
        bool DeleteChapter(Guid chapterId);
        AdminChapterContentModel AddContent(AdminChapterContentModel model);
        AdminChapterContentModel UpdateContent(AdminChapterContentModel updateContent);
        bool DeleteContent(Guid contentId);

        //Question/Option
        AdminQuestionModel AddQuestion(AdminQuestionModel model);
        AdminQuestionModel UpdateQuestion(AdminQuestionModel updateQuestion);
        bool DeleteQuestion(Guid questionId);
        AdminOptinModel AddOption(AdminOptinModel model);
        AdminOptinModel UpdateOption(AdminOptinModel updateOption);
        bool DeleteOption(Guid optionId);
    }
}
