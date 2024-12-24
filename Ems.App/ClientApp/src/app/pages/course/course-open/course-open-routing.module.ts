import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseOpenComponent } from './course-open.component';

const routes: Routes = [
  { path: '', component: CourseOpenComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseOpenRoutingModule {}
