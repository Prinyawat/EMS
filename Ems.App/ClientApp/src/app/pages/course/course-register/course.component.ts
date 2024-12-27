import { Component, OnInit} from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { course } from '../mock-course';

@Component({
  selector: 'app-course-register',
  templateUrl: './course.component.html',
  styleUrls:['./course-register.component.scss'],
  providers: [MessageService]

})
export class CourseComponent implements OnInit{ 
  
  display: boolean = false;
  breadcrumbItems: MenuItem[] = [];
  course = course;
  
  constructor(
    private messageService: MessageService
  ){}

  ngOnInit() {
  this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Course'});
    this.breadcrumbItems.push({ label: 'ลงทะเบียน', styleClass: 'custom-register'});
  }

  showSuccessViaToast(courseId: number) {
    console.log('ลงทะเบียนคอร์ส:', courseId);
    this.messageService.add({ key: 'tst', severity: 'success', summary: 'ลงทะเบียนสำเร็จ', detail: 'คุณได้ลงทะเบียนอบรบเรียนเสร็จสิ้น' });
  }
  
}
