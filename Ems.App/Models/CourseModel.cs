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
        public List<QuestionModel> questions { get; set; } = new List<QuestionModel>();

        public string statusComputed { get; set; }
    }

    public class ChapterModel
    {
        public Guid chapterId { get; set; }
        public string title { get; set; }
        public List<ContentModel> contents { get; set; } = new List<ContentModel>();
    }

    public class ContentModel
    {
        public Guid contentId { get; set; }
        public string contentTitle { get; set; }
        public string body { get; set; }
        public bool recordRead { get; set; }
    }

    public class RecordProgressModel
    {
        public Guid courseId { get; set; }
        public Guid chapterId { get; set; }
        public Guid contentId { get; set; }
    }

    public class QuestionModel
    {
        public Guid questionId { get; set; }
        public string questionText { get; set; }
        public List<OptionModel> options { get; set; } = new List<OptionModel>();
    }

    public class OptionModel
    {
        public Guid optionId { get; set; }
        public string optionText { get; set; }
        public bool isCorrect { get; set; }
    }

    public class UserQuestionModel
    {
        public Guid userquestionId { get; set; }
        public Guid userId { get; set; }
        public Guid courseId { get; set; }
        public Guid questionId { get; set; }
        public Guid optionId { get; set; }
    }

    public class UserResultModel
    {
        public Guid resultId { get; set; }
        public Guid userId { get; set; }
        public Guid courseId { get; set; }
        public int score { get; set; }
        public int totalQuestions { get; set; }
        public bool passStatus { get; set; }
    }

}
