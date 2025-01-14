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
  // filteredCourses = [];
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

  // this.filteredCourses = this.courseService
  //     .getCourses()
  //     .filter((c) => c.status !== 'เสร็จสิ้น')
  //     .sort((a, b) => (b.status === 'ลงทะเบียนแล้ว' ? 1 : 0) - (a.status === 'ลงทะเบียนแล้ว' ? 1 : 0));
  this.fetchCourses();
  }

  fetchCourses() {
    this.courseService.getCourses().subscribe((data: Course[]) => {
      this.filteredCourses = data
    });
  }

  // showSuccessViaToast(courseId: number) {
  //   console.log('ลงทะเบียนคอร์ส:', courseId);
  //   this.courseService.registerCourse(courseId); 
  //   if (!this.registrationOrder.includes(courseId)) {
  //     this.registrationOrder.push(courseId);
  //   }
  //   this.filteredCourses = this.courseService
  //     .getCourses()
  //     .filter((c) => c.status !== 'เสร็จสิ้น')
  //     .sort((a, b) => 
  //       (a.status === 'ลงทะเบียนแล้ว' ? 0 : 1) - 
  //       (b.status === 'ลงทะเบียนแล้ว' ? 0 : 1) ||
  //       this.registrationOrder.indexOf(a.id) - this.registrationOrder.indexOf(b.id)
  //     );
  //   this.messageService.add({ key: 'tst', severity: 'success', summary: 'ลงทะเบียนสำเร็จ', detail: 'คุณได้ลงทะเบียนอบรบเรียนเสร็จสิ้น' });
  // }
  
  // showCanCelViaToast(courseId: number) {
  //   console.log('ยกเลิกการลงทะเบียน:', courseId);
  //   this.courseService.cancelRegistration(courseId);
  //   this.registrationOrder = this.registrationOrder.filter(id => id !== courseId);
  //   this.filteredCourses = this.courseService
  //     .getCourses()
  //     .filter((c) => c.status !== 'เสร็จสิ้น')
  //     .sort((a, b) => 
  //       (a.status === 'ลงทะเบียนแล้ว' ? 0 : 1) - 
  //       (b.status === 'ลงทะเบียนแล้ว' ? 0 : 1) ||
  //       this.registrationOrder.indexOf(a.id) - this.registrationOrder.indexOf(b.id)
  //     );
  //   this.messageService.add({ key: 'tst', severity: 'error', summary: 'ยกเลิกการลงทะเบียน', detail: 'คุณได้ยกเลิกการลงทะเบียนแล้ว' });
  // }
}
