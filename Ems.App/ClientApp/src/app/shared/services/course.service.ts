import { Injectable } from '@angular/core';
import { Course } from 'src/app/pages/course/mock-course';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
    private course = Course;

    constructor(
    ) {}

    getCourses() {
      return this.course;
    }

    getCourseById(courseId: number) {
      return this.course.find((c) => c.id === courseId);
    }

    getRegisteredCourses() {
      return this.course.filter((c) => c.status === 'ลงทะเบียนแล้ว' || c.status === 'เสร็จสิ้น');
    }
      

    registerCourse(courseId: number) {
      const course = this.course.find((c) => c.id === courseId);
      if (course) {
          course.status = 'ลงทะเบียนแล้ว';
      }
    }

    cancelRegistration(courseId: number) {
      const course = this.course.find((c) => c.id === courseId);
      if (course) {
        course.status = ''; 
      }
    }

    getCompletedCourses() {
      return this.course.filter((c) => c.status === 'เสร็จสิ้น');
    }

    getCurrentQuestion(courseId: number, questionIndex: number) {
      const course = this.getCourseById(courseId);
      return course?.questions[questionIndex];
    }
    
    updateSelectedOption(courseId: number, questionIndex: number, selectedOptionId: number): void {
      const course = this.getCourseById(courseId);
      if (course && course.questions[questionIndex]) {
        course.questions[questionIndex].selectedOptionId = selectedOptionId;
      }
    }
    
    updateQuizResult(courseId: number, score: number, passStatus: boolean): void {
      const course = this.getCourseById(courseId);
      if (course) {
        course.score = score;
        course.passStatus = passStatus;
      }
    }
      
    updateCourseStatus(courseId: number, status: string): void {
      const course = this.getCourseById(courseId);
      if (course) {
        course.status = status;
      }
    }
      
} 