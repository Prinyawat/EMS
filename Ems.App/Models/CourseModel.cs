using Ems.Data.Entities;

namespace Ems.App.Models
{
    public class CourseModel
    {
        public Guid courseId { get; set; }
        public string courseName { get; set; }
        public string subtitle { get; set; }
        public string description { get; set; }
        public DateOnly startDate { get; set; }
        public DateOnly endDate { get; set; }
        public TimeOnly startTime { get; set; }
        public TimeOnly endTime { get; set; }
        public string statusName { get; set; }
        public bool IsRegistered => statusName == "ลงทะเบียนแล้ว";
        public List<ChapterModel> chapters { get; set; } = new List<ChapterModel>();
    }

    public class ChapterModel
    {
        public Guid chapterId { get; set; }
        public string title { get; set; }
    }
}
