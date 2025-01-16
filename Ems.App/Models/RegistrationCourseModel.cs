namespace Ems.App.Models
{
    public class RegistrationCourseModel
    {
        public Guid registrationId { get; set; }
        public Guid userId { get; set; }
        public Guid courseId { get; set; }
        public Guid statusId { get; set; }
    }
}
