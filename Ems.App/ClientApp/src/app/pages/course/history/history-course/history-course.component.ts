import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Course } from 'src/app/shared/models/course.model';
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
  filteredCourses: Course[] = [];

  constructor(
    private courseService: CourseService
  ){}
    

  ngOnInit() {
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Course'});
    this.breadcrumbItems.push({ label: 'ประวัติ'});
    this.breadcrumbItems.push({ label: 'ประวัติการเรียน', styleClass: 'custom-register'});

    this.courseService.getCompletedCourses().subscribe((courses: Course[]) => {
          this.filteredCourses = courses;
        });
    }

}
