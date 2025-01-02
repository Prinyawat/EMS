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

    getRegisteredCourses() {
        return this.course.filter((c) => c.status === 'ลงทะเบียนแล้ว');
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
        const course = this.course.find((c) => c.id === courseId);
        return course?.questions[questionIndex];
    }

    
    getNextQuestion(courseId: number, currentQuestionIndex: number) {
        const course = this.course.find((c) => c.id === courseId);
        if (course && currentQuestionIndex < course.questions.length - 1) {
        return course.questions[currentQuestionIndex + 1];
        }
        return null;
    }

    getPreviousQuestion(courseId: number, currentQuestionIndex: number) {
        const course = this.course.find((c) => c.id === courseId);
        if (course && currentQuestionIndex > 0) {
        return course.questions[currentQuestionIndex - 1];
        }
        return null;
    }

    
}