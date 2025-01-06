import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: HomeComponent }
        // { path: 'course-register', data: { breadcrumb: 'course-register' }, loadChildren: () => import('./home.module').then(m => m.HomeModule) }
    ])],
    exports: [RouterModule]
})

export class HomeRoutingModule { }