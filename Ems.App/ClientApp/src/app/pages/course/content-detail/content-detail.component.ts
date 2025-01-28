import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/shared/services/course.service';

@Component({
  selector: 'app-content-detail',
  templateUrl: './content-detail.component.html',
  styleUrls: ['./content-detail.component.scss'],
})
export class ContentDetailComponent implements OnInit {
  course: any;
  chapters: any;
  contents: any;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {

    const courseId = this.route.snapshot.params['courseId'];
    const chapterId = this.route.snapshot.params['chapterId'];
    const contentId = this.route.snapshot.params['contentId'];

    this.courseService.getCourseById(courseId).subscribe((course) => {
      this.course = course;
      const chapters = this.course?.chapters.find((ch) => ch.chapterId === chapterId);
    
      if (chapters) {
        this.chapters = chapters; 
        this.contents = chapters.contents.find((content) => content.contentId === contentId);

        this.courseService.recordProgress(courseId, chapterId, contentId).subscribe(() => {
        });
      }
    });
  }
}
