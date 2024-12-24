import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
@NgModule({
    imports: [RouterModule.forChild([
        { path: 'registrationhistory-course', data: { breadcrumb: 'registrationhistory-course' }, loadChildren: () => import('./registration-history-course/registration-history-course.module').then(m => m.RegistrationHistoryCourseModule) },
        { path: 'ristory-course', data: { breadcrumb: 'ristory-course' }, loadChildren: () => import('./history-course/history-course.module').then(m => m.HistoryCourseModule) }
    ])],
    exports: [RouterModule]
})
export class HistoryRoutingModule { }