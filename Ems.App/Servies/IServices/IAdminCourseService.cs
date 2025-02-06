using Ems.App.Models;
using Ems.Data.Entities;

namespace Ems.App.Servies.IServices
{
    public interface IAdminCourseService
    {
        AdminCourseModel AddCourse(AdminCourseModel model);
        AdminCourseModel UpdateCourse(AdminCourseModel updatedCourse);
        bool DeleteCourse(Guid courseId);
        AdminChapterModel AddChapter(AdminChapterModel model);
        AdminChapterModel UpdateChapter(AdminChapterModel updatedChapter);
        bool DeleteChapter(Guid chapterId);
    }
}
