import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseRegisterComponent } from './course-register.component';

const routes: Routes = [
  { path: '', component: CourseRegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseRegisterRoutingModule {}
