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
import { DataViewModule } from 'primeng/dataview';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToolbarModule } from 'primeng/toolbar';
import { CalendarModule } from 'primeng/calendar';
import { TreeTableModule } from 'primeng/treetable';
import { CheckboxModule } from 'primeng/checkbox';
import { AdminChapterComponent } from '../Admin-chapter/admin-chapter.component';
import { ConfirmationService } from 'primeng/api';
import { EditorModule } from 'primeng/editor';


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
    DataViewModule,
    FormsModule,
    TableModule,
    RatingModule,
    SliderModule,
    InputTextModule,
    ToggleButtonModule,
    RippleModule,
    MultiSelectModule,
    DropdownModule,
    ProgressBarModule,
    ToolbarModule,
    CalendarModule,
    TreeTableModule,
    CheckboxModule,
    EditorModule
  ],
  declarations: [
    AdminCourseComponent,
    AdminChapterComponent
  ],
  providers: [ConfirmationService]
})
export class AdminCourseModule {}
