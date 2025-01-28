import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Course, Question} from '../models/course.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {

    constructor(
      private http: HttpClient
    ) {}

    env: string = `${environment.apiUrl}/api/Course`;

    getCourses() {
      return this.http.get(this.env + "/getCourses");
    }

    getRegisteredCourses() {
      return this.http.get(this.env + "/getRegisteredCourses");
    }
    
    getCompletedCourses() {
      return this.http.get(this.env + "/getCompletedCourses");
    }
       
    getCourseById(courseId: string) {
      return this.http.get<Course>(`${this.env}/getCourseById/${courseId}`);
    } 

    registerCourse(courseId: string) {
      const payload = { courseId };
      return this.http.post(this.env + "/registerCourse", payload);
    }

    cancelRegistration(courseId: string) {
      return this.http.delete(`${this.env}/cancelRegistration/${courseId}`);
    }
    
    recordProgress(courseId: string, chapterId: string, contentId: string) {
      const payload = { courseId, chapterId, contentId };
      return this.http.post(this.env +"/recordProgress", payload);
    }
    
    saveUserAnswers(answers: { courseId: string; questionId: string; optionId: string }[]) {
      return this.http.post<{ score: number; totalQuestions: number; passStatus: boolean }>
      (`${this.env}/saveAnswers`, answers);
    }

    calculateResult(courseId: string) {
      return this.http.get<any>(`${this.env}/api/Course/calculateResult/${courseId}`);
    }
    
} 