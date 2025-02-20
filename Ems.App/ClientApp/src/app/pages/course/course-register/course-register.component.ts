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
  // registrationOrder: number[] = [];

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
  this.breadcrumbItems.push({ label: 'หลักสูตร'});
  this.breadcrumbItems.push({ label: 'ลงทะเบียน', styleClass: 'custom-register'});

  this.fetchCourses();
  }

  fetchCourses() {
    this.courseService.getCourses().subscribe((data: Course[]) => {
      this.courseService.getCompletedCourses().subscribe((completedCourses: Course[]) => {
        const completedCourseIds = new Set(completedCourses.map(course => course.courseId));
        const now = new Date();
  
        this.registeredCourses = data.filter(course => {
          if (course.statusName === 'ลงทะเบียนแล้ว' && !completedCourseIds.has(course.courseId)) {
            const startDateTime = new Date(course.startDate);
            const [hours, minutes] = course.startTime.split(':').map(Number);
            startDateTime.setHours(hours, minutes);
            return now < startDateTime; 
          }
          return false;
        });
  
        this.unregisteredCourses = data.filter(course => {
          if (course.statusName !== 'ลงทะเบียนแล้ว') {
            const endDateTime = new Date(course.endDate);
            const [hours, minutes] = course.endTime.split(':').map(Number);
            endDateTime.setHours(hours, minutes);
            return now < endDateTime; 
          }
          return false;
        });
  
        this.showRegisteredCourses = this.registeredCourses.length > 0;
      });
    });
  }
  
  
  formatTime(time: string | Date): string {
    if (!time) return '';
    if (typeof time === 'string') {
        return time.slice(0, 5);
    }
    const date = new Date(time);
    return date.toTimeString().slice(0, 5);
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
        severity: 'success',
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
    });
  }
  
}
