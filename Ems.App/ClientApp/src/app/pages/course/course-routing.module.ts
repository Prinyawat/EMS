import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
@NgModule({
    imports: [RouterModule.forChild([
        { path: 'course-register', data: { breadcrumb: 'course-register' }, loadChildren: () => import('./course-register/course-register.module').then(m => m.CourseRegisterModule) },
        { path: 'RegistrationHistory-course', data: { breadcrumb: 'RegistrationHistory-course' }, loadChildren: () => import('./registration-history-course/registration-history-course.module').then(m => m.RegistrationHistoryCourseModule) },
    ])],
    exports: [RouterModule]
})
export class CauseRoutingModule { }