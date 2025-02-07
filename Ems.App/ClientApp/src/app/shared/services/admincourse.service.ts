import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminCourseService {

    constructor(
      private http: HttpClient
    ) {}

    env: string = `${environment.apiUrl}/api/AdminCourse`;

    //course
    addCourse(model: any){
      return this.http.post(`${this.env}/addCourse`, model);
    }

    deleteCourse(courseId: string) {
      return this.http.delete(`${this.env}/deleteCourse/${courseId}`);
    }

    updateCourse(updatedCourse: any) {
      return this.http.put(`${this.env}/updateCourse`, updatedCourse);
    }

    //chapter
    addchapter(model: any) {
      return this.http.post(`${this.env}/addChapter`, model)
    }

    deleteChapter(chapterId: string) {
      return this.http.delete(`${this.env}/deleteChapter/${chapterId}`)
    }

    updateChapter(updatedChapter: any) {
      return this.http.put(`${this.env}/updateChapter`, updatedChapter);
    }

    //content
    addContent(model: any) {
      return this.http.post(`${this.env}/addContent`, model)
    }
    
    deleteContent(contentId: string) {
      return this.http.delete(`${this.env}/deleteContent/${contentId}`)
    }

    updateContent(updatedContent: any) {
      return this.http.put(`${this.env}/updateContent`, updatedContent);
    }

}
