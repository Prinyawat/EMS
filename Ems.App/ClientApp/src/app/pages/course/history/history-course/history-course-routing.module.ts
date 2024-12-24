import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryCourseComponent } from './history-course.component';

const routes: Routes = [{ path: '', component: HistoryCourseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryCourseRoutingModule { }
