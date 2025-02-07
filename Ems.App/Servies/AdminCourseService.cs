using Ems.App.Models;
using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Ems.App.Servies
{
    public class AdminCourseService : IAdminCourseService
    {
        private readonly EmsContext _emsContext;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IIdentityService _identityService;

        public AdminCourseService(EmsContext emsContext, IHubContext<NotificationHub> hubContext, IIdentityService identityService)
        {
            _emsContext = emsContext;
            _hubContext = hubContext;
            _identityService = identityService;
        }
        public AdminCourseModel AddCourse(AdminCourseModel model)
        {
            if (model == null)
            {
                throw new ArgumentException("ข้อมูลคอร์สไม่ถูกต้อง");
            }

            var currentUser = _identityService.GetCurrentUser();

            var newCourse = new course
            {
                course_id = Guid.NewGuid(),
                course_name = model.courseName,
                subtitle = model.subtitle,
                description = model.description,
                start_date = model.startDate,
                end_date = model.endDate,
                start_time = model.startTime,
                end_time = model.endTime,
                created_by = currentUser.ToString()
            };

            _emsContext.course.Add(newCourse);
            _emsContext.SaveChanges();

            return new AdminCourseModel
            {
                courseId = newCourse.course_id,
                courseName = newCourse.course_name,
                subtitle = newCourse.subtitle,
                description = newCourse.description,
                startDate = newCourse.start_date,
                endDate = newCourse.end_date,
                startTime = newCourse.start_time,
                endTime = newCourse.end_time
            };
        }

        public bool DeleteCourse(Guid courseId)
        {
            var courseToDelete = _emsContext.course.FirstOrDefault(c => c.course_id == courseId);
            if (courseToDelete == null)
            {
                return false;
            }

            _emsContext.course.Remove(courseToDelete);
            _emsContext.SaveChanges();
            return true;
        }

        public AdminCourseModel UpdateCourse(AdminCourseModel updatedCourse)
        {
            if (updatedCourse == null || updatedCourse.courseId == Guid.Empty)
            {
                throw new ArgumentException("ข้อมูลคอร์สไม่ถูกต้อง");
            }

            var existingCourse = _emsContext.course.FirstOrDefault(c => c.course_id == updatedCourse.courseId);
            if (existingCourse == null)
            {
                throw new KeyNotFoundException("ไม่พบคอร์สที่ต้องการอัปเดต");
            }

            var currentUser = _identityService.GetCurrentUser();

            existingCourse.course_name = updatedCourse.courseName;
            existingCourse.subtitle = updatedCourse.subtitle;
            existingCourse.description = updatedCourse.description;
            existingCourse.start_date = updatedCourse.startDate;
            existingCourse.end_date = updatedCourse.endDate;
            existingCourse.start_time = updatedCourse.startTime;
            existingCourse.end_time = updatedCourse.endTime;
            existingCourse.updated_by = currentUser.ToString(); 

            _emsContext.SaveChanges();

            return new AdminCourseModel
            {
                courseId = existingCourse.course_id,
                courseName = existingCourse.course_name,
                subtitle = existingCourse.subtitle,
                description = existingCourse.description,
                startDate = existingCourse.start_date,
                endDate = existingCourse.end_date,
                startTime = existingCourse.start_time,
                endTime = existingCourse.end_time
            };
        }

        public AdminChapterModel AddChapter(AdminChapterModel model)
        {
            if (model == null)
            {
                throw new ArgumentException("ข้อมูลบทเรียนไม่ถูกต้อง");
            }

            var currentUser = _identityService.GetCurrentUser();

            var newChapter = new chapter
            {
                chapter_id = Guid.NewGuid(),
                course_id = model.courseId,
                chapter_title = model.title,
                created_by = currentUser.ToString(),
                created_date = DateTime.UtcNow
            };

            _emsContext.chapter.Add(newChapter);
            _emsContext.SaveChanges();

            return new AdminChapterModel
            {
                chapterId = newChapter.chapter_id,
                courseId = newChapter.course_id,
                title = newChapter.chapter_title
            };
        }

        public AdminChapterModel UpdateChapter(AdminChapterModel updatedChapter)
        {
            if (updatedChapter == null || updatedChapter.chapterId == Guid.Empty)
            {
                throw new ArgumentException("ข้อมูลบทเรียนไม่ถูกต้อง");
            }

            var existingChapter = _emsContext.chapter.FirstOrDefault(c => c.chapter_id == updatedChapter.chapterId);
            if (existingChapter == null)
            {
                throw new KeyNotFoundException("ไม่พบบทเรียนที่ต้องการอัปเดต");
            }

            var currentUser = _identityService.GetCurrentUser();

            existingChapter.chapter_title = updatedChapter.title;
            existingChapter.updated_by = currentUser.ToString();
            existingChapter.updated_date = DateTime.UtcNow;

            _emsContext.SaveChanges();

            return new AdminChapterModel
            {
                chapterId = existingChapter.chapter_id,
                courseId = existingChapter.course_id,
                title = existingChapter.chapter_title
            };
        }

        public bool DeleteChapter(Guid chapterId)
        {
            var chapterToDelete = _emsContext.chapter.FirstOrDefault(c => c.chapter_id == chapterId);
            if (chapterToDelete == null)
            {
                return false;
            }

            _emsContext.chapter.Remove(chapterToDelete);
            _emsContext.SaveChanges();
            return true;
        }

        public AdminChapterContentModel AddContent(AdminChapterContentModel model)
        {
            if (model == null)
            {
                throw new ArgumentException("ข้อมูลหัวข้อไม่ถูกต้อง");
            }

            var currentUser = _identityService.GetCurrentUser();

            var newContent = new chapter_content
            {
                chapter_content_id = Guid.NewGuid(),
                chapter_id = model.chapterId,
                content_title = model.contentTitle,
                content_body = model.body,
                created_by = currentUser.ToString(),
                created_date = DateTime.UtcNow
            };

            _emsContext.chapter_content.Add(newContent);
            _emsContext.SaveChanges();

            return new AdminChapterContentModel
            {
                contentId = newContent.chapter_content_id,
                chapterId = newContent.chapter_id,
                contentTitle = newContent.content_title,
                body = newContent.content_body
            };
        }

        public AdminChapterContentModel UpdateContent(AdminChapterContentModel updateContent)
        {
            if (UpdateContent == null || updateContent.contentId == Guid.Empty)
            {
                throw new ArgumentException("ข้อมูลหัวข้อไม่ถูกต้อง");
            }

            var existingContent = _emsContext.chapter_content.FirstOrDefault(c => c.chapter_content_id == updateContent.contentId);
            if (existingContent == null)
            {
                throw new KeyNotFoundException("ไม่พบหัวข้อที่ต้องการอัปเดต");
            }

            var currentUser = _identityService.GetCurrentUser();

            existingContent.content_title = updateContent.contentTitle;
            existingContent.content_body = updateContent.body;
            existingContent.updated_by = currentUser.ToString();
            existingContent.updated_date = DateTime.UtcNow;

            _emsContext.SaveChanges();

            return new AdminChapterContentModel
            {
                contentId = existingContent.chapter_content_id,
                chapterId = existingContent.chapter_id,
                contentTitle = existingContent.content_title,
                body = existingContent.content_body
            };
        }

        public bool DeleteContent(Guid contentId)
        {
            var contentToDelete = _emsContext.chapter_content.FirstOrDefault(cc => cc.chapter_content_id == contentId);
            if (contentToDelete == null)
            {
                return false;
            }

            _emsContext.chapter_content.Remove(contentToDelete);
            _emsContext.SaveChanges();
            return true;
                
        }

        public AdminQuestionModel AddQuestion(AdminQuestionModel model)
        {
            if (model == null)
            {
                throw new ArgumentException("ข้อมูลคำถามไม่ถูกต้อง");
            }

            var currentUser = _identityService.GetCurrentUser();

            var newQuestion = new question
            {
                question_id = Guid.NewGuid(),
                course_id = model.courseId,
                question_text = model.questionText,
                created_by = currentUser.ToString(),
                created_date = DateTime.UtcNow
            };

            _emsContext.question.Add(newQuestion);
            _emsContext.SaveChanges();

            return new AdminQuestionModel
            {
                questionId = newQuestion.question_id,
                courseId = newQuestion.course_id,
                questionText = newQuestion.question_text,
            
            };
        }

        public AdminQuestionModel UpdateQuestion(AdminQuestionModel updateQuestion)
        {
            if (updateQuestion == null || updateQuestion.questionId == Guid.Empty)
            {
                throw new ArgumentException("ข้อมูลคำถามไม่ถูกต้อง");
            }

            var existingQustion = _emsContext.question.FirstOrDefault(q => q.question_id == updateQuestion.questionId);
            if (existingQustion == null)
            {
                throw new KeyNotFoundException("ไม่พบคำถามที่ต้องการอัปเดต");
            }

            var currentUser = _identityService.GetCurrentUser();

            existingQustion.question_text = updateQuestion.questionText;
            existingQustion.updated_by = currentUser.ToString();
            existingQustion.updated_date = DateTime.UtcNow;

            _emsContext.SaveChanges();

            return new AdminQuestionModel
            {
                questionId = existingQustion.question_id,
                courseId = existingQustion.course_id,
                questionText = existingQustion.question_text,

            };
        }

        public bool DeleteQuestion(Guid questionId)
        {
            var questiontToDelete = _emsContext.question.FirstOrDefault(q => q.question_id == questionId);
            if (questiontToDelete == null)
            {
                return false;
            }

            _emsContext.question.Remove(questiontToDelete);
            _emsContext.SaveChanges();
            return true;

        }

        public AdminOptinModel AddOption(AdminOptinModel model)
        {
            if (model == null)
            {
                throw new ArgumentException("ข้อมูลตัวเลือกไม่ถูกต้อง");
            }

            var currentUser = _identityService.GetCurrentUser();

            var newOption = new option
            {
                option_id = Guid.NewGuid(),
                question_id = model.questionId,
                option_text = model.optionText,
                is_correct = model.isCorrect,
                created_by = currentUser.ToString(),
                created_date = DateTime.UtcNow
            };

            _emsContext.option.Add(newOption);
            _emsContext.SaveChanges();

            return new AdminOptinModel
            {
                optionId = newOption.option_id,
                questionId = newOption.question_id,
                optionText = newOption.option_text,
                isCorrect = newOption.is_correct

            };
        }

        public AdminOptinModel UpdateOption(AdminOptinModel updateOption)
        {
            if (updateOption == null || updateOption.optionId == Guid.Empty)
            {
                throw new ArgumentException("ข้อมูลตัวเลือกไม่ถูกต้อง");
            }

            var existingOption = _emsContext.option.FirstOrDefault(p => p.option_id == updateOption.optionId);
            if (existingOption == null)
            {
                throw new KeyNotFoundException("ไม่พบตัวเลือกที่ต้องการอัปเดต");
            }

            var currentUser = _identityService.GetCurrentUser();

            existingOption.option_text = updateOption.optionText;
            existingOption.is_correct = updateOption.isCorrect;
            existingOption.updated_by = currentUser.ToString();
            existingOption.updated_date = DateTime.UtcNow;

            _emsContext.SaveChanges();

            return new AdminOptinModel
            {
                optionId = existingOption.option_id,
                questionId = existingOption.question_id,
                optionText = existingOption.option_text,
                isCorrect = existingOption.is_correct

            };
        }

        public bool DeleteOption(Guid optionId)
        {
            var optionToDelete = _emsContext.option.FirstOrDefault(p => p.option_id == optionId);
            if (optionToDelete == null)
            {
                return false;
            }

            _emsContext.option.Remove(optionToDelete);
            _emsContext.SaveChanges();
            return true;

        }

    }

}

