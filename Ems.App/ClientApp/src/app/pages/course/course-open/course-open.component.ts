import { Component, OnInit} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { course } from '../mock-course';

@Component({
  selector: 'app-course-open',
  templateUrl: './course-open.component.html',
  styleUrls:['./course-open.component.scss'],
  providers: []

})
export class CourseOpenComponent implements OnInit{

  display: boolean = false;
  breadcrumbItems: MenuItem[] = [];
  course = course;
  filteredCourses: any[] = [];

  constructor(

  ){}

  ngOnInit():void {
    this.breadcrumbItems = [];
      this.breadcrumbItems.push({ label: 'Course'});
      this.breadcrumbItems.push({ label: 'Course เปิดเรียน', styleClass: 'custom-register'});

    const allowedIds = [1,3]; 
    this.filteredCourses = this.course.filter((c) => allowedIds.includes(c.id));
  }

  
}
