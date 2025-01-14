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
    }
}
