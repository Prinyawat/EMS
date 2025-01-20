import { Component, OnInit} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Course } from 'src/app/shared/models/course.model';
import { CourseService } from 'src/app/shared/services/course.service';


@Component({
  selector: 'app-course-open',
  templateUrl: './course-open.component.html',
  styleUrls:['./course-open.component.scss'],
  providers: []

})
export class CourseOpenComponent implements OnInit{

  display: boolean = false;
  breadcrumbItems: MenuItem[] = [];
  
  filteredCourses: Course[] = [];

  constructor(
    private courseService: CourseService
  ){}

  ngOnInit():void {
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Course'});
    this.breadcrumbItems.push({ label: 'Course เปิดเรียน', styleClass: 'custom-register'});

    // this.filteredCourses = this.courseService.getRegisteredCourses();
    this.courseService.getRegisteredCourses().subscribe((courses: Course[]) => {
      this.filteredCourses = courses;
    });
  }

  
}
