using Ems.Data.Entities;

namespace Ems.App.Models
{
    public class AdminCourseModel
    {
        public Guid courseId { get; set; }
        public string courseName { get; set; }
        public string subtitle { get; set; }
        public string description { get; set; }
        public DateOnly startDate { get; set; }
        public DateOnly endDate { get; set; }
        public TimeOnly startTime { get; set; }
        public TimeOnly endTime { get; set; }

    }

    public class AdminChapterModel
    {
        public Guid chapterId { get; set; }
        public Guid courseId { get; set; }
        public string title { get; set; }
    }

    public partial class AdminChapterContentModel
    {
        public Guid contentId { get; set; }
        public Guid chapterId { get; set; }
        public string contentTitle { get; set; }
        public string body { get; set; }
    }
}
