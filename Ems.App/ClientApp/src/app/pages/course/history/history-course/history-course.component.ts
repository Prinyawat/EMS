import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { course } from '../../mock-course';

@Component({
  selector: 'app-history-course',
  templateUrl: './history-course.component.html',
  styleUrls:['./history-course.component.scss'],
  providers: [MessageService]
})
export class HistoryCourseComponent {
  
  display: boolean = false;
  breadcrumbItems: MenuItem[] = [];
  course = course;
  filteredCourses: any[] = [];

  constructor(
  ){}
    

  ngOnInit() {
    this.breadcrumbItems = [];
      this.breadcrumbItems.push({ label: 'Course'});
      this.breadcrumbItems.push({ label: 'ประวัติ'});
      this.breadcrumbItems.push({ label: 'ประวัติการเรียน/อบรบ', styleClass: 'custom-register'});

    const allowedIds = [2]; 
    this.filteredCourses = this.course.filter((c) => allowedIds.includes(c.id));
    }

}
