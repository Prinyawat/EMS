import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { course } from '../mock-course';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit {
  course: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.params['courseId']); 
    this.course = course.find((c) => c.id === courseId);
  }
  
}
