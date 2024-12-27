import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { course } from '../../mock-course';

@Component({
  selector: 'app-registration-history-course',
  templateUrl: './registration-history-course.component.html',
  styleUrls:['./registration-history-course.component.scss'],
  providers: [MessageService]
})
export class RegistrationHistoryCourseComponent {
  
  display: boolean = false;
  breadcrumbItems: MenuItem[] = [];
  course = course;
  filteredCourses: any[] = [];  
  constructor(
    private messageService: MessageService,
  ){}

  ngOnInit() {
    this.breadcrumbItems = [];
      this.breadcrumbItems.push({ label: 'Course'});
      this.breadcrumbItems.push({ label: 'ประวัติ'});
      this.breadcrumbItems.push({ label: 'ประวัติการลงทะเบียน', styleClass: 'custom-register'});

    const allowedIds = [1,3]; 
    this.filteredCourses = this.course.filter((c) => allowedIds.includes(c.id));
    }

  showCanCelViaToast(courseId: number) {
    console.log('ยกเลิกการลงทะเบียน:', courseId);
    this.filteredCourses = this.filteredCourses.filter((c) => c.id !== courseId);
    this.messageService.add({ key: 'tst', severity: 'error', summary: 'ยกเลิกการลงทะเบียน', detail: 'คุณได้ยกเลิกการลงทะเบียนแล้ว' });
}

}
