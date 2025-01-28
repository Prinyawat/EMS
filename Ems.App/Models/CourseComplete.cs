namespace Ems.App.Models
{
    public class CourseCompleteModel
    {
        public Guid coursecomplete_id { get; set; }
        public Guid userId { get; set; }
        public Guid courseId { get; set; }
        public Guid statusId { get; set; }
    }
}
