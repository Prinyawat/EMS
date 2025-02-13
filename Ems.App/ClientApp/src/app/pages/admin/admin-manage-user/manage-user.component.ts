import { Component, OnInit} from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';


@Component({
    selector: 'app-manage-user',
    templateUrl: './manage-user.component.html',
    styleUrls: ['./manage-user.component.scss'],
    providers: [MessageService],
    standalone: false
})
export class ManageUserComponent implements OnInit{ 
  
  breadcrumbItems: MenuItem[] = [];
  loading: boolean = true;

  constructor(

  ){}

  ngOnInit() {
  this.breadcrumbItems = [];
  this.breadcrumbItems.push({ label: 'Admin'});
  this.breadcrumbItems.push({ label: 'จัดการบัญชีผู้ใช้', styleClass: 'custom-admin'});

  this.loading = false;
  }
}
