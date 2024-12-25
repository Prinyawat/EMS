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
  constructor(

  ){}

  ngOnInit():void {
    this.breadcrumbItems = [];
      this.breadcrumbItems.push({ label: 'Course'});
      this.breadcrumbItems.push({ label: 'Course เปิดเรียน', styleClass: 'custom-register'});
  }


}
