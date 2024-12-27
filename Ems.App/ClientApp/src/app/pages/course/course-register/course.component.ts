import { Component, OnInit} from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { CourseService } from 'src/app/shared/services/course.service';

@Component({
  selector: 'app-course-register',
  templateUrl: './course.component.html',
  styleUrls:['./course-register.component.scss'],
  providers: [MessageService]

})
export class CourseComponent implements OnInit{ 
  
  display: boolean = false;
  breadcrumbItems: MenuItem[] = [];
  filteredCourses = [];

  constructor(
    private messageService: MessageService,
    private courseService: CourseService
  ){}

  ngOnInit() {
  this.breadcrumbItems = [];
  this.breadcrumbItems.push({ label: 'Course'});
  this.breadcrumbItems.push({ label: 'ลงทะเบียน', styleClass: 'custom-register'});

  this.filteredCourses = this.courseService
    .getCourses()
    .filter((c) => c.status !== 'เสร็จสิ้น');
  }

  showSuccessViaToast(courseId: number) {
    console.log('ลงทะเบียนคอร์ส:', courseId);
    this.courseService.registerCourse(courseId); 
    this.filteredCourses = this.courseService
      .getCourses()
      .filter((c) => c.status !== 'เสร็จสิ้น'); 
    this.messageService.add({ key: 'tst', severity: 'success', summary: 'ลงทะเบียนสำเร็จ', detail: 'คุณได้ลงทะเบียนอบรบเรียนเสร็จสิ้น' });
  }
  
}
