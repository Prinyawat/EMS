import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/shared/services/course.service';

@Component({
    selector: 'app-chapter-content',
    templateUrl: './chapter-content.component.html',
    styleUrls: ['./chapter-content.component.scss'],
    standalone: false
})
export class ChapterContentComponent implements OnInit {
  course: any;
  chapters: any;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.params['courseId'];
    const chapterId = this.route.snapshot.params['chapterId'];
    
    this.courseService.getCourseById(courseId).subscribe((course) => {
      this.course = course;
      this.chapters = this.course?.chapters.find((ch) => ch.chapterId === chapterId);

    });
  }
  
  getNextContentRouterLink(): string | any[] {
    if (this.isAllContentRead()) {
      return ['/course/course-open', this.course?.courseId];
    }
  
    const nextContent = this.chapters?.contents.find((content: any) => !content.recordRead);
    return nextContent ? [nextContent.contentId] : null;
  }
  
  canNavigateNext(): boolean {
    return this.isAllContentRead() || this.chapters?.contents.some((content: any) => !content.recordRead);
  }
  
  isAllContentRead(): boolean {
    return this.chapters?.contents?.every((content: any) => content.recordRead);
  }
}
