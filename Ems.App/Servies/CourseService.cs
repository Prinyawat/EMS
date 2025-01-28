using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using Microsoft.EntityFrameworkCore;

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
            var existingProgress = _emsContext.user_progress
                .Any(up => up.user_id == userId &&
                           up.course_id == courseId &&
                           up.chapter_id == chapterId &&
                           up.content_id == contentId);

            if (!existingProgress)
            {
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
        //public void SaveUserAnswers(List<UserQuestionModel> answers)
        //{
        //    foreach (var answer in answers)
        //    {
        //        var existingAnswer = _emsContext.user_question
        //            .FirstOrDefault(uq => uq.user_id == answer.userId &&
        //                                  uq.course_id == answer.courseId &&
        //                                  uq.question_id == answer.questionId);

        //        if (existingAnswer == null)
        //        {
        //            var newAnswer = new user_question
        //            {
        //                user_question_id = Guid.NewGuid(),
        //                user_id = answer.userId,
        //                course_id = answer.courseId,
        //                question_id = answer.questionId,
        //                option_id = answer.optionId,
        //                created_by = answer.userId.ToString(),
        //                created_date = DateTime.UtcNow
        //            };

        //            _emsContext.user_question.Add(newAnswer);
        //        }
        //        else
        //        {

        //            existingAnswer.option_id = answer.optionId;
        //            existingAnswer.updated_by = answer.userId.ToString();
        //            existingAnswer.updated_date = DateTime.UtcNow;

        //            _emsContext.user_question.Update(existingAnswer);
        //        }
        //    }

        //    _emsContext.SaveChanges();
        //}
        //public void SaveUserAnswers(List<UserQuestionModel> answers)
        //{
        //    foreach (var answer in answers)
        //    {
        //        var existingAnswer = _emsContext.user_question
        //            .FirstOrDefault(uq => uq.user_id == answer.userId &&
        //                                  uq.course_id == answer.courseId &&
        //                                  uq.question_id == answer.questionId);

        //        if (existingAnswer == null)
        //        {
        //            var newAnswer = new user_question
        //            {
        //                user_question_id = Guid.NewGuid(),
        //                user_id = answer.userId,
        //                course_id = answer.courseId,
        //                question_id = answer.questionId,
        //                option_id = answer.optionId,
        //                created_by = answer.userId.ToString(),
        //                created_date = DateTime.UtcNow
        //            };

        //            _emsContext.user_question.Add(newAnswer);
        //        }
        //        else
        //        {
        //            existingAnswer.option_id = answer.optionId;
        //            existingAnswer.updated_by = answer.userId.ToString();
        //            existingAnswer.updated_date = DateTime.UtcNow;

        //            _emsContext.user_question.Update(existingAnswer);
        //        }
        //    }

        //    _emsContext.SaveChanges();


        //    if (answers.Any())
        //    {
        //        var userId = answers.First().userId;
        //        var courseId = answers.First().courseId;
        //        CalculateUserResult(userId, courseId);
        //    }
        //}

        //public UserResultModel CalculateUserResult(Guid userId, Guid courseId)
        //{
        //    var totalQuestions = _emsContext.question
        //        .Where(q => q.course_id == courseId)
        //        .Count();

        //    var correctAnswers = _emsContext.user_question
        //        .Where(uq => uq.user_id == userId && uq.course_id == courseId)
        //        .Join(_emsContext.option,
        //            uq => uq.option_id,
        //            o => o.option_id,
        //            (uq, o) => new { o.is_correct })
        //        .Count(o => o.is_correct == true);

        //    var passStatus = correctAnswers >= (totalQuestions / 2);

        //    var existingResult = _emsContext.user_result
        //        .FirstOrDefault(r => r.user_id == userId && r.course_id == courseId);

        //    if (existingResult == null)
        //    {
        //        var result = new user_result
        //        {
        //            result_id = Guid.NewGuid(),
        //            user_id = userId,
        //            course_id = courseId,
        //            score = correctAnswers,
        //            total_questions = totalQuestions,
        //            pass_status = passStatus,
        //            created_date = DateTime.UtcNow
        //        };

        //        _emsContext.user_result.Add(result);
        //        _emsContext.SaveChanges();

        //        return new UserResultModel
        //        {
        //            resultId = result.result_id,
        //            userId = result.user_id,
        //            courseId = result.course_id,
        //            score = result.score,
        //            totalQuestions = result.total_questions,
        //            passStatus = result.pass_status
        //        };
        //    }

        //    return new UserResultModel
        //    {
        //        resultId = existingResult.result_id,
        //        userId = existingResult.user_id,
        //        courseId = existingResult.course_id,
        //        score = existingResult.score,
        //        totalQuestions = existingResult.total_questions,
        //        passStatus = existingResult.pass_status
        //    };
        //}

        public void SaveUserAnswers(List<UserQuestionModel> answers)
        {
            var userId = answers.First().userId;
            var courseId = answers.First().courseId;

            // ลบคำตอบเก่าใน user_question ที่เกี่ยวข้องกับ user และ course นี้
            var existingAnswers = _emsContext.user_question
                .Where(uq => uq.user_id == userId && uq.course_id == courseId)
                .ToList();

            if (existingAnswers.Any())
            {
                _emsContext.user_question.RemoveRange(existingAnswers);
            }

            // เพิ่มคำตอบใหม่
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

            // คำนวณและอัปเดตผลลัพธ์ใหม่
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

            // อัปเดตหรือสร้างผลลัพธ์ใหม่
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
