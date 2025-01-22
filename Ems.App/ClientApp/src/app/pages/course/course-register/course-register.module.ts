import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseRegisterRoutingModule } from './course-register-routing.module';
import { CourseRegisterComponent } from './course-register.component';

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
    CourseRegisterRoutingModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    BreadcrumbModule,
    TagModule,
    ConfirmPopupModule,
    DataViewModule
  ],
  declarations: [CourseRegisterComponent,],
  providers: [ConfirmationService]
})
export class CourseRegisterModule {}
