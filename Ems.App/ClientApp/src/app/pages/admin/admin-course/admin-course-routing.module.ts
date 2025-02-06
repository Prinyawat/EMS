import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCourseComponent } from './admin-course.component';
import { AdminChapterComponent } from '../Admin-chapter/admin-chapter.component';

const routes: Routes = [
  { path: '', component: AdminCourseComponent },
  { path: ':courseId', component: AdminChapterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminCourseRoutingModule {}
