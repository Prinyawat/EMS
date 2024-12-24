import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseOpenComponent } from './course-open.component';
import { CourseOpenRoutingModule } from './course-open-routing.module';


import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
  imports: [
    CommonModule,
    CourseOpenRoutingModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    BreadcrumbModule
  ],
  declarations: [CourseOpenComponent]
})
export class CourseOpenModule {}