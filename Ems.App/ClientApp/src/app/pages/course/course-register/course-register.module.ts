import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseRegisterRoutingModule } from './course-register-routing.module';
import { CourseComponent } from './course.component';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    CourseRegisterRoutingModule,
    DialogModule,
    ButtonModule,
    ToastModule
  ],
  declarations: [CourseComponent,]
})
export class CourseRegisterModule {}
