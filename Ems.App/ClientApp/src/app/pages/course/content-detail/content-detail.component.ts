import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { course } from '../mock-course';

@Component({
  selector: 'app-content-detail',
  templateUrl: './content-detail.component.html',
  // styleUrls: ['./content-detail.component.scss'],
})
export class ContentDetailComponent implements OnInit {
  course: any;
  chapter: any;
  content: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.params['courseId']);
    const chapterId = Number(this.route.snapshot.params['chapterId']);
    const contentId = Number(this.route.snapshot.params['contentId']);

    this.course = course.find((c) => c.id === courseId);
    this.chapter = this.course?.chapters.find((ch) => ch.id === chapterId);
    this.content = this.chapter?.contents.find((co) => co.id === contentId);
  }
}
