import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
@NgModule({
    imports: [RouterModule.forChild([
        { path: 'checking', data: { breadcrumb: 'checking' }, loadChildren: () => import('./checking/checking.module').then(m => m.CheckingComponentModule) },
        { path: 'leave-request', data: { breadcrumb: 'leave-request' }, loadChildren: () => import('./leave-request/leave-request.module').then(m => m.LeaveRequestComponentModule) },
        { path: 'agenda', data: { breadcrumb: 'agenda' }, loadChildren: () => import('./agenda-checking/agenda.module').then(m => m.AgendaComponentModule) }
    ])],
    exports: [RouterModule]
})
export class CheckingInformationRoutingModule { }
