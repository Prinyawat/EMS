import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationHistoryCourseComponent } from './registration-history-course.component';

const routes: Routes = [{ path: '', component: RegistrationHistoryCourseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationHistoryCourseRoutingModule { }
