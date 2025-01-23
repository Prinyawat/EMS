using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;

namespace Ems.App.Servies
{
    public class CourseService : ICourseService
    {
        private readonly EmsContext _emsContext;

        public CourseService(EmsContext emsContext)
        {
            _emsContext = emsContext;
        }

        public List<CourseModel> GetCourses()
        {
            var userId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad"); 
            return _emsContext.course.Select(c => new CourseModel
            {
                courseId = c.course_id,
                courseName = c.course_name,
                subtitle = c.subtitle,
                description = c.description,
                startDate = c.start_date,
                endDate = c.end_date,
                startTime = c.start_time,
                endTime = c.end_time,
                statusName = _emsContext.registration
                    .Where(r => r.course_id == c.course_id && r.user_id == userId)
                    .Select(r => r.status.status_name)
                    .SingleOrDefault() ?? ""
            }).ToList();
        }

        public CourseModel GetCourseById(Guid courseId)
        {
            var userId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad");

            var course = _emsContext.course
                .Where(c => c.course_id == courseId)
                .Select(c => new CourseModel
                {
                    courseId = c.course_id,
                    courseName = c.course_name,
                    subtitle = c.subtitle,
                    description = c.description,
                    startDate = c.start_date,
                    endDate = c.end_date,
                    startTime = c.start_time,
                    endTime = c.end_time,
                    chapters = c.chapter.Select(ch => new ChapterModel
                    {
                        chapterId = ch.chapter_id,
                        title = ch.chapter_title,
                        contents = ch.chapter_content.Select(ct => new ContentModel
                        {
                            contentId = ct.content_id,
                            contentTitle = ct.content_title,
                            body = ct.content_body,
                            recordRead = _emsContext.user_progress
                                .Any(up => up.user_id == userId &&
                                           up.course_id == courseId &&
                                           up.chapter_id == ch.chapter_id &&
                                           up.content_id == ct.content_id)
                        }).ToList()
                    }).ToList(),
                    questions = c.question
                    .OrderBy(q => q.created_date) // เรียงลำดับคำถามตามวันที่สร้าง
                    .Select(q => new QuestionModel
                    {
                        questionId = q.question_id,
                        questionText = q.question_text,
                        options = q.option.Select(o => new OptionModel
                        {
                            optionId = o.option_id,
                            optionText = o.option_text,
                            isCorrect = o.is_correct ?? false
                        }).ToList()
                    }).ToList()
                }).FirstOrDefault();

            return course;
        }

        public List<CourseModel> GetRegisteredCourses()
        {
            var userId = new Guid("42cfb3be-fa01-499a-95af-fa0a879fb0ad"); 
            return _emsContext.registration
                .Where(r => r.user_id == userId && r.status.status_name == "ลงทะเบียนแล้ว")
                .Select(r => new CourseModel
                {
                    courseId = r.course_id,
                    courseName = r.course.course_name,
                    subtitle = r.course.subtitle,
                    description = r.course.description,
                    startDate = r.course.start_date,
                    endDate = r.course.end_date,
                    startTime = r.course.start_time,
                    endTime = r.course.end_time,
                    statusName = r.status.status_name
                }).ToList();
        }

        public RegistrationCourseModel RegisterCourse(RegistrationCourseModel model)
        {
            var registeredStatus = _emsContext.status
                .FirstOrDefault(s => s.status_name == "ลงทะเบียนแล้ว");

            var registration = new registration
            {
                registration_id = Guid.NewGuid(),
                user_id = model.userId,
                course_id = model.courseId,
                status_id = registeredStatus.status_id
            };

            _emsContext.registration.Add(registration);
            _emsContext.SaveChanges();

            return new RegistrationCourseModel
            {
                registrationId = registration.registration_id,
                userId = registration.user_id,
                courseId = registration.course_id,
                statusId = registration.status_id
            };
        }

        public void CancelRegistration(Guid userId, Guid courseId)
        {
            var registration = _emsContext.registration
                .FirstOrDefault(r => r.user_id == userId && r.course_id == courseId);

            if (registration != null)
            {
                _emsContext.registration.Remove(registration);
                _emsContext.SaveChanges();
            }
        }

        public void RecordProgress(Guid userId, Guid courseId, Guid chapterId, Guid contentId)
        {
            // ตรวจสอบว่าไม่มี record ซ้ำใน user_progress
            var existingProgress = _emsContext.user_progress
                .Any(up => up.user_id == userId &&
                           up.course_id == courseId &&
                           up.chapter_id == chapterId &&
                           up.content_id == contentId);

            if (!existingProgress)
            {
                // สร้าง record ใหม่
                var progress = new user_progress
                {
                    user_progress_id = Guid.NewGuid(),
                    user_id = userId,
                    course_id = courseId,
                    chapter_id = chapterId,
                    content_id = contentId,
                    record_read = true,
                    created_by = userId.ToString(),
                    created_date = DateTime.UtcNow
                };

                _emsContext.user_progress.Add(progress);
                _emsContext.SaveChanges();
            }
        }

    }
}
