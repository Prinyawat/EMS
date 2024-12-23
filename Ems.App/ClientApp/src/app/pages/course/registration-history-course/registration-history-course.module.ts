import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationHistoryCourseRoutingModule } from './registration-history-course-routing.module';
import { RegistrationHistoryCourseComponent } from './registration-history-course.component';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    RegistrationHistoryCourseRoutingModule,
    DialogModule,
    ButtonModule,
    ToastModule
  ],
  declarations: [RegistrationHistoryCourseComponent]
})
export class RegistrationHistoryCourseModule { }
