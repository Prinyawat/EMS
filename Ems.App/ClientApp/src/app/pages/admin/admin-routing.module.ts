import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
@NgModule({
    imports: [RouterModule.forChild([
        { path: 'manage-user', data: { breadcrumb: 'manage-user' }, loadChildren: () => import('./admin-manage-user/manage-user.module').then(m => m.ManageUserModule) },
        { path: 'admin-course', data: { breadcrumb: 'manage-user' }, loadChildren: () => import('./admin-course/admin-course.module').then(m => m.AdminCourseModule) },

    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }