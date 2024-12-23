import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-registration-history-course',
  templateUrl: './registration-history-course.component.html',
  styleUrls:['./registration-history-course.component.scss'],
  providers: [MessageService]
})
export class RegistrationHistoryCourseComponent {
  
  display: boolean = false;
  breadcrumbItems: MenuItem[] = [];
  
  constructor(
    private messageService: MessageService,
  ){}
    
  courses = [
    {
      id: 1,
      title: 'Angular',
      subtitle: 'คอร์สเรียนรู้พื้นฐาน การใช้ Angular',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      openDate: new Date(2024, 0, 15), 
      closeDate: new Date(2024, 0, 20), 
      openTime: '09:00', 
      closeTime: '17:00', 
      display: false, 
    },
    {
      id: 2,
      title: 'React',
      subtitle: 'คอร์สเรียนรู้พื้นฐาน การใช้ React',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      openDate: new Date(2024, 0, 25), 
      closeDate: new Date(2024, 0, 30), 
      openTime: '09:00', 
      closeTime: '17:00', 
      display: false,
    },
  ]

  ngOnInit() {
    this.breadcrumbItems = [];
            this.breadcrumbItems.push({ label: 'Course'});
            this.breadcrumbItems.push({ label: 'ประวัติการลงทะเบียน', styleClass: 'custom-register'});
    }

  showCanCelViaToast(courseId: number) {
    console.log('ยกเลิกการลงทะเบียน:', courseId);
    this.messageService.add({ key: 'tst', severity: 'error', summary: 'ยกเลิกการลงทะเบียน', detail: 'คุณได้ยกเลิกการลงทะเบียนแล้ว' });
}

}
