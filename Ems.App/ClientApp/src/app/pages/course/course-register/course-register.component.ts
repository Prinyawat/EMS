import { Component, OnInit} from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
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
  // filteredCourses: Course[] = [];

  registeredCourses: Course[] = [];
  unregisteredCourses: Course[] = [];
  showRegisteredCourses: boolean = false;
  
  constructor(
    private messageService: MessageService,
    private courseService: CourseService,
    private confirmationService: ConfirmationService
  ){}

  ngOnInit() {
  this.breadcrumbItems = [];
  this.breadcrumbItems.push({ label: 'Course'});
  this.breadcrumbItems.push({ label: 'ลงทะเบียน', styleClass: 'custom-register'});

  this.fetchCourses();
  }

  // fetchCourses() {
  //   this.courseService.getCourses().subscribe((data: Course[]) => {
  //     this.filteredCourses = data.sort((a, b) => {
  //       if (a.statusName === "ลงทะเบียนแล้ว" && b.statusName !== "ลงทะเบียนแล้ว") {
  //         return -1; 
  //       } else if (a.statusName !== "ลงทะเบียนแล้ว" && b.statusName === "ลงทะเบียนแล้ว") {
  //         return 1; 
  //       }
  //       return 0; 
  //     });
  //   });
  // }  

  fetchCourses() {
    this.courseService.getCourses().subscribe((data: Course[]) => {
      this.registeredCourses = data.filter(course => course.statusName === 'ลงทะเบียนแล้ว');
      this.unregisteredCourses = data.filter(course => course.statusName !== 'ลงทะเบียนแล้ว');
      this.showRegisteredCourses = this.registeredCourses.length > 0;
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
      this.showRegisteredCourses = true;
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

  confirmCanCelViaToast(event: Event, courseId: string) {
    this.confirmationService.confirm({
      key: 'confirmCanCelViaToast',
      target: event.target || new EventTarget(),
      message: 'คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการลงทะเบียน?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.showCanCelViaToast(courseId); 
      },
      // reject: () => {
      //   this.messageService.add({
      //     key: 'tst',
      //     severity: 'info',
      //     summary: 'ถูกยกเลิก',
      //     detail: 'การยกเลิกถูกยกเลิก'
      //   });
      // }
    });
  }
  
}
