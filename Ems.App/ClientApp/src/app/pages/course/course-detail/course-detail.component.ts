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
  
}
