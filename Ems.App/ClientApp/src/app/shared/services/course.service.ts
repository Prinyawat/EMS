import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from 'src/app/pages/course/mock-course';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
    private course = Course;

    constructor(
      private http: HttpClient
    ) {}

    env: string = `${environment.apiUrl}/api/Course`;

    getCourses() {
      return this.http.get(this.env + "/getCourses");
    }

    registerCourse(courseId: string) {
      const payload = { courseId };
      return this.http.post(this.env + "/registerCourse", payload);
    }

    cancelRegistration(courseId: string) {
      return this.http.delete(`${this.env}/cancelRegistration/${courseId}`);
    }
    
    getRegisteredCourses() {
      return this.http.get(this.env + "/getRegisteredCourses");
      // return this.course.filter((c) => c.status === 'ลงทะเบียนแล้ว' || c.status === 'เสร็จสิ้น');
    }
    
    getCourseById(courseId: string) {
      return this.http.get<typeof Course>(`${this.env}/getCourseById/${courseId}`);
    }    
    
    recordProgress(courseId: string, chapterId: string, contentId: string) {
      const payload = { courseId, chapterId, contentId };
      return this.http.post(this.env +"/recordProgress", payload);
    }
    
    getCompletedCourses() {
      return this.course.filter((c) => c.status === 'เสร็จสิ้น');
    }

    // getCourseByIds(courseId: number) {
    //   return this.course.find((c) => c.id === courseId);
    //   }
    
    // updateSelectedOption(courseId: number, questionIndex: number, selectedOptionId: number): void {
    //   const course = this.getCourseById(courseId);
    //   if (course && course.questions[questionIndex]) {
    //     course.questions[questionIndex].selectedOptionId = selectedOptionId;
    //   }
    // }
    
    // updateQuizResult(courseId: number, score: number, passStatus: boolean): void {
    //   const course = this.getCourseById(courseId);
    //   if (course) {
    //     course.score = score;
    //     course.passStatus = passStatus;
    //   }
    // }
      
    // updateCourseStatus(courseId: number, status: string): void {
    //   const course = this.getCourseById(courseId);
    //   if (course) {
    //     course.status = status;
    //   }
    // }
      
} 