import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
@NgModule({
    imports: [RouterModule.forChild([
        { path: 'course-register', data: { breadcrumb: 'course-register' }, loadChildren: () => import('./course-register/course-register.module').then(m => m.CourseRegisterModule) },
        { path: 'history', data: { breadcrumb: 'history' }, loadChildren: () => import('./history/history.module').then(m => m.HistoryModule) },
        { path: 'course-open', data: { breadcrumb: 'course-open' }, loadChildren: () => import('./course-open/course-open.module').then(m => m.CourseOpenModule) }
    ])],
    exports: [RouterModule]
})
export class CauseRoutingModule { }