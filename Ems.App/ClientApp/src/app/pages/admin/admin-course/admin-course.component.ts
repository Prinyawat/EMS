import { Component, OnInit} from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';


@Component({
  selector: 'app-manage-user',
  templateUrl: './admin-course.component.html',
  styleUrls:['./admin-course.component.scss'],
  providers: [MessageService]

})
export class AdminCourseComponent implements OnInit{ 
  
  breadcrumbItems: MenuItem[] = [];

  constructor(

  ){}

  ngOnInit() {
  this.breadcrumbItems = [];
  this.breadcrumbItems.push({ label: 'Admin'});
  this.breadcrumbItems.push({ label: 'จัดการ Course', styleClass: 'custom-admin'});

  }
}
