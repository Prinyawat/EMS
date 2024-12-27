import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseRegisterRoutingModule } from './course-register-routing.module';
import { CourseComponent } from './course.component';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TagModule } from 'primeng/tag';

@NgModule({
  imports: [
    CommonModule,
    CourseRegisterRoutingModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    BreadcrumbModule,
    TagModule
  ],
  declarations: [CourseComponent,]
})
export class CourseRegisterModule {}
