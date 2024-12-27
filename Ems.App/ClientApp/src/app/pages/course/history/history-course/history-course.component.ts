import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { CourseService } from 'src/app/shared/services/course.service';


@Component({
  selector: 'app-history-course',
  templateUrl: './history-course.component.html',
  styleUrls:['./history-course.component.scss'],
  providers: [MessageService]
})
export class HistoryCourseComponent {
  
  display: boolean = false;
  breadcrumbItems: MenuItem[] = [];
  filteredCourses: any[] = [];

  constructor(
    private courseService: CourseService
  ){}
    

  ngOnInit() {
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Course'});
    this.breadcrumbItems.push({ label: 'ประวัติ'});
    this.breadcrumbItems.push({ label: 'ประวัติการเรียน/อบรบ', styleClass: 'custom-register'});

    this.filteredCourses = this.courseService.getCompletedCourses();
    }

}
