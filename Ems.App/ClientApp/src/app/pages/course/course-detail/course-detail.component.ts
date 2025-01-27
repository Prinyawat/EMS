import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { CourseService } from 'src/app/shared/services/course.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit {
  course: any;
  showResultDialog: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.params['courseId'];
    this.courseService.getCourseById(courseId).subscribe((course) => {
      this.course = course;
    });
  }

  isChapterCompleted(chapter: any): boolean {
    return chapter.contents.every((content: any) => content.recordRead);
  }
  
  getNextChapterRouterLink(): string | any[] {
    if (!this.course?.chapters) return null;
  
    const nextIncompleteChapter = this.course.chapters.find(
      (chapter: any) => !this.isChapterCompleted(chapter)
    );
  
    if (!nextIncompleteChapter) {
      const firstCompletedChapter = this.course.chapters.find((chapter: any) =>
        this.isChapterCompleted(chapter)
      );
      return firstCompletedChapter ? [firstCompletedChapter.chapterId] : null;
    }
  
    return [nextIncompleteChapter.chapterId];
  }

  isAllChaptersCompleted(): boolean {
    if (!this.course?.chapters) return false;
    return this.course.chapters.every((chapter: any) =>
      this.isChapterCompleted(chapter)
    );
  }
  
  
  // canNavigateNext(): boolean {
  //   return (
  //     this.course?.chapters?.length > 0 &&
  //     (this.course.chapters.some((chapter: any) => !this.isChapterCompleted(chapter)) ||
  //       this.course.chapters.some((chapter: any) => this.isChapterCompleted(chapter)))
  //   );
  // }
}
