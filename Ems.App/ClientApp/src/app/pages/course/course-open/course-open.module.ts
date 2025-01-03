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
import { TableModule } from 'primeng/table';
import { QuizComponent } from '../quiz/quiz.component';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CourseOpenRoutingModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    BreadcrumbModule,
    TableModule,
    CheckboxModule,
    RadioButtonModule
  ],
  declarations: [
    CourseOpenComponent,
    CourseDetailComponent,
    ChapterContentComponent,
    ContentDetailComponent,
    QuizComponent
  ]
})
export class CourseOpenModule {}