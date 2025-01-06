import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    // const courseId = Number(this.route.snapshot.params['courseId']); 
    // this.course =  this.courseService.getCourses().find((c) => c.id === courseId);
    const courseId = Number(this.route.snapshot.params['courseId']); 
    this.course = this.courseService.getCourseById(courseId);
  }
  
}
