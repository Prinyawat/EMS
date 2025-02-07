using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Ems.App.Servies
{
    public class CourseService : ICourseService
    {
        private readonly EmsContext _emsContext;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IIdentityService _identityService;

        public CourseService(EmsContext emsContext, IHubContext<NotificationHub> hubContext, IIdentityService identityService)
        {
            _emsContext = emsContext;
            _hubContext = hubContext;
            _identityService = identityService;
        }

        public List<CourseModel> GetCourses()
        {
            Guid userId = this._identityService.GetCurrentUser();
            return _emsContext.course
                .OrderBy(c => c.created_date)
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
                statusName = _emsContext.registration
                    .Where(r => r.course_id == c.course_id && r.user_id == userId)
                    .Select(r => r.status.status_name)
                    .SingleOrDefault() ?? ""
            }).ToList();
        }

        public CourseModel GetCourseById(Guid courseId)
        {
            Guid userId = this._identityService.GetCurrentUser();
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
                    chapters = c.chapter
                    .OrderBy(ch => ch.created_date)
                    .Select(ch => new ChapterModel
                    {
                        chapterId = ch.chapter_id,
                        title = ch.chapter_title,
                        contents = ch.chapter_content
                        .OrderBy(ch => ch.created_date)
                        .Select(ct => new ContentModel
                        {
                            contentId = ct.chapter_content_id,
                            contentTitle = ct.content_title,
                            body = ct.content_body,
                            recordRead = _emsContext.user_progress
                                .Any(up => up.user_id == userId &&
                                           up.course_id == courseId &&
                                           up.chapter_id == ch.chapter_id &&
                                           up.chapter_content_id == ct.chapter_content_id)
                        }).ToList()
                    }).ToList(),
                    questions = c.question
                    .OrderBy(q => q.created_date)
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
            Guid userId = this._identityService.GetCurrentUser();
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

        public List<CourseModel> GetCompletedCourses()
        {
            Guid userId = this._identityService.GetCurrentUser();
            return _emsContext.course_complete
                .Where(r => r.user_id == userId && (r.status.status_name == "เสร็จสิ้น" || r.status.status_name == "ไม่ผ่าน"))
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

            var user = _emsContext.user.FirstOrDefault(u => u.user_id == model.userId);
            var course = _emsContext.course.FirstOrDefault(c => c.course_id == model.courseId);

            if (user == null || course == null || registeredStatus == null)
                throw new Exception("ข้อมูลไม่ถูกต้อง");

            var registration = new registration
            {
                registration_id = Guid.NewGuid(),
                user_id = model.userId,
                course_id = model.courseId,
                status_id = registeredStatus.status_id
            };

            _emsContext.registration.Add(registration);
            _emsContext.SaveChanges();

            var message = $"{user.first_name} ได้ลงทะเบียนคอร์ส {course.course_name} แล้ว!";
            _hubContext.Clients.All.SendAsync("ReceiveNotification", message);

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
                .Include(r => r.course)
                .FirstOrDefault(r => r.user_id == userId && r.course_id == courseId);

            if (registration != null)
            {
                var user = _emsContext.user.FirstOrDefault(u => u.user_id == userId);
                var course = _emsContext.course.FirstOrDefault(c => c.course_id == courseId);

                _emsContext.registration.Remove(registration);
                _emsContext.SaveChanges();

                var message = $"{user.first_name} ได้ยกเลิกการลงทะเบียนคอร์ส {course.course_name} แล้ว!";
                _hubContext.Clients.All.SendAsync("ReceiveNotification", message);
            }
        }

        public void RecordProgress(Guid userId, Guid courseId, Guid chapterId, Guid contentId)
        {
            var existingProgress = _emsContext.user_progress
                .Any(up => up.user_id == userId &&
                           up.course_id == courseId &&
                           up.chapter_id == chapterId &&
                           up.chapter_content_id == contentId);

            if (!existingProgress)
            {
                var progress = new user_progress
                {
                    user_progress_id = Guid.NewGuid(),
                    user_id = userId,
                    course_id = courseId,
                    chapter_id = chapterId,
                    chapter_content_id = contentId,
                    record_read = true,
                    created_by = userId.ToString(),
                    created_date = DateTime.UtcNow
                };

                _emsContext.user_progress.Add(progress);
                _emsContext.SaveChanges();
            }
        }

        public void SaveUserAnswers(List<UserQuestionModel> answers)
        {
            var userId = answers.First().userId;
            var courseId = answers.First().courseId;


            var existingAnswers = _emsContext.user_question
                .Where(uq => uq.user_id == userId && uq.course_id == courseId)
                .ToList();

            if (existingAnswers.Any())
            {
                _emsContext.user_question.RemoveRange(existingAnswers);
            }


            foreach (var answer in answers)
            {
                var newAnswer = new user_question
                {
                    user_question_id = Guid.NewGuid(),
                    user_id = answer.userId,
                    course_id = answer.courseId,
                    question_id = answer.questionId,
                    option_id = answer.optionId,
                    created_by = answer.userId.ToString(),
                    created_date = DateTime.UtcNow
                };

                _emsContext.user_question.Add(newAnswer);
            }

            _emsContext.SaveChanges();


            CalculateUserResult(userId, courseId);
        }

        public UserResultModel CalculateUserResult(Guid userId, Guid courseId)
        {
            var totalQuestions = _emsContext.question
                .Where(q => q.course_id == courseId)
                .Count();

            var correctAnswers = _emsContext.user_question
                .Where(uq => uq.user_id == userId && uq.course_id == courseId)
                .Join(_emsContext.option,
                    uq => uq.option_id,
                    o => o.option_id,
                    (uq, o) => new { o.is_correct })
                .Count(o => o.is_correct == true);

            var passStatus = correctAnswers >= (totalQuestions / 2);

            // อัปเดตหรือสร้างผลลัพธ์ใน user_result
            var existingResult = _emsContext.user_result
                .FirstOrDefault(r => r.user_id == userId && r.course_id == courseId);

            if (existingResult != null)
            {
                existingResult.score = correctAnswers;
                existingResult.total_questions = totalQuestions;
                existingResult.pass_status = passStatus;
                existingResult.updated_date = DateTime.UtcNow;

                _emsContext.user_result.Update(existingResult);
            }
            else
            {
                var newResult = new user_result
                {
                    result_id = Guid.NewGuid(),
                    user_id = userId,
                    course_id = courseId,
                    score = correctAnswers,
                    total_questions = totalQuestions,
                    pass_status = passStatus,
                    created_date = DateTime.UtcNow
                };

                _emsContext.user_result.Add(newResult);
            }

            // ตรวจสอบสถานะแล้วอัปเดตข้อมูลใน coursecomplete
            var courseComplete = _emsContext.course_complete
                .FirstOrDefault(cc => cc.user_id == userId && cc.course_id == courseId);

            if (courseComplete != null)
            {
                // อัปเดตสถานะที่มีอยู่
                courseComplete.status_id = passStatus
                    ? _emsContext.status.First(s => s.status_name == "เสร็จสิ้น").status_id
                    : _emsContext.status.First(s => s.status_name == "ไม่ผ่าน").status_id;
                courseComplete.updated_date = DateTime.UtcNow;

                _emsContext.course_complete.Update(courseComplete);
            }
            else
            {
                // เพิ่มข้อมูลใหม่ใน coursecomplete
                var newCourseComplete = new course_complete
                {
                    course_complete_id = Guid.NewGuid(),
                    user_id = userId,
                    course_id = courseId,
                    status_id = passStatus
                        ? _emsContext.status.First(s => s.status_name == "เสร็จสิ้น").status_id
                        : _emsContext.status.First(s => s.status_name == "ไม่ผ่าน").status_id,
                    created_date = DateTime.UtcNow
                };

                _emsContext.course_complete.Add(newCourseComplete);
            }

            _emsContext.SaveChanges();

            return new UserResultModel
            {
                resultId = existingResult?.result_id ?? Guid.NewGuid(),
                userId = userId,
                courseId = courseId,
                score = correctAnswers,
                totalQuestions = totalQuestions,
                passStatus = passStatus
            };
        }

    }
}
