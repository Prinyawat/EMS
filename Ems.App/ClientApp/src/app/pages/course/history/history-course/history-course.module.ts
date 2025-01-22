import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryCourseRoutingModule } from './history-course-routing.module';
import { HistoryCourseComponent } from './history-course.component';


import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';

@NgModule({
  imports: [
    CommonModule,
    HistoryCourseRoutingModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    BreadcrumbModule,
    TagModule,
    DataViewModule
  ],
  declarations: [HistoryCourseComponent]
})
export class HistoryCourseModule { }
