import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  providers: [MessageService]

})
export class CourseComponent { 
  
  display: boolean = false;

  constructor(
    private messageService: MessageService
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


  showSuccessViaToast(courseId: number) {
    console.log('ลงทะเบียนคอร์ส:', courseId);
    this.messageService.add({ key: 'tst', severity: 'success', summary: 'ลงทะเบียนสำเร็จ', detail: 'คุณได้ลงทะเบียนอบรบเรียนเสร็จสิ้น' });
}
}
