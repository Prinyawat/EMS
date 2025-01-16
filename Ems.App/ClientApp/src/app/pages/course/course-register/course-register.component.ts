import { Component, OnInit} from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Course } from 'src/app/shared/models/course.model';
import { CourseService } from 'src/app/shared/services/course.service';

@Component({
  selector: 'app-course-register',
  templateUrl: './course-register.component.html',
  styleUrls:['./course-register.component.scss'],
  providers: [MessageService]

})
export class CourseRegisterComponent implements OnInit{ 
  
  display: boolean = false;
  breadcrumbItems: MenuItem[] = [];
  registrationOrder: number[] = [];
  filteredCourses: Course[] = [];
  
  constructor(
    private messageService: MessageService,
    private courseService: CourseService
  ){}

  ngOnInit() {
  this.breadcrumbItems = [];
  this.breadcrumbItems.push({ label: 'Course'});
  this.breadcrumbItems.push({ label: 'ลงทะเบียน', styleClass: 'custom-register'});

  this.fetchCourses();
  }

  fetchCourses() {
    this.courseService.getCourses().subscribe((data: Course[]) => {
      this.filteredCourses = data
    });
  }

  showSuccessViaToast(courseId: string) {
    this.courseService.registerCourse(courseId).subscribe(() => {
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'ลงทะเบียนสำเร็จ',
        detail: 'คุณได้ลงทะเบียนอบรบเรียนเสร็จสิ้น'
      });
      this.fetchCourses();
    });
  }

  showCanCelViaToast(courseId: string) {
    this.courseService.cancelRegistration(courseId).subscribe(() => {
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'ยกเลิกการลงทะเบียน',
        detail: 'คุณได้ยกเลิกการลงทะเบียนแล้ว'
      });
      this.fetchCourses();
    });
  }
}
