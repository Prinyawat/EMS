import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCourseRoutingModule, } from './admin-course-routing.module';
import { AdminCourseComponent, } from './admin-course.component';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TagModule } from 'primeng/tag';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { DataViewModule } from 'primeng/dataview';


@NgModule({
  imports: [
    CommonModule,
    AdminCourseRoutingModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    BreadcrumbModule,
    TagModule,
    ConfirmPopupModule,
    DataViewModule
  ],
  declarations: [AdminCourseComponent],
  providers: [ConfirmationService]
})
export class AdminCourseModule {}
