import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { CourseService } from 'src/app/shared/services/course.service';

@Component({
  selector: 'app-registration-history-course',
  templateUrl: './registration-history-course.component.html',
  styleUrls:['./registration-history-course.component.scss'],
  providers: [MessageService]
})
export class RegistrationHistoryCourseComponent {
  
  display: boolean = false;
  breadcrumbItems: MenuItem[] = [];
  filteredCourses: any[] = [];
    
  constructor(
    private messageService: MessageService,
    private courseService: CourseService
  ){}

  ngOnInit() {
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Course'});
    this.breadcrumbItems.push({ label: 'ประวัติ'});
    this.breadcrumbItems.push({ label: 'ประวัติการลงทะเบียน', styleClass: 'custom-register'});

    this.filteredCourses = this.courseService.getRegisteredCourses();
    }

//   showCanCelViaToast(courseId: number) {
//     console.log('ยกเลิกการลงทะเบียน:', courseId);
//     this.courseService.cancelRegistration(courseId); 
//     this.filteredCourses = this.courseService.getRegisteredCourses();
//     this.messageService.add({ key: 'tst', severity: 'error', summary: 'ยกเลิกการลงทะเบียน', detail: 'คุณได้ยกเลิกการลงทะเบียนแล้ว' });
// }

}
