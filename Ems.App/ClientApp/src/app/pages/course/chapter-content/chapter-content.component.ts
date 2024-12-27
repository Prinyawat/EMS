import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/shared/services/course.service';

@Component({
  selector: 'app-chapter-content',
  templateUrl: './chapter-content.component.html',
  styleUrls: ['./chapter-content.component.scss']
})
export class ChapterContentComponent implements OnInit {
  course: any;
  chapter: any;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.params['courseId']);
    const chapterId = Number(this.route.snapshot.params['chapterId']);
    this.course = this.courseService.getCourses().find((c) => c.id === courseId);
    this.chapter = this.course?.chapters.find((ch) => ch.id === chapterId);
  }
  
}
