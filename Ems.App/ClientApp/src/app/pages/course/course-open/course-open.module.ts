import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseOpenComponent } from './course-open.component';
import { CourseOpenRoutingModule } from './course-open-routing.module';


import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CourseDetailComponent } from '../course-detail/course-detail.component';
import { ChapterContentComponent } from '../chapter-content/chapter-content.component';
import { ContentDetailComponent } from '../content-detail/content-detail.component';

@NgModule({
  imports: [
    CommonModule,
    CourseOpenRoutingModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    BreadcrumbModule
  ],
  declarations: [
    CourseOpenComponent,
    CourseDetailComponent,
    ChapterContentComponent,
    ContentDetailComponent
  ]
})
export class CourseOpenModule {}