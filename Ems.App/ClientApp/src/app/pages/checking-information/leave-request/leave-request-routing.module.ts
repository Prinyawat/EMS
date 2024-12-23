import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LeaveRequestComponent } from './leave-request.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LeaveRequestComponent }
    ])],
    exports: [RouterModule]
})
export class LeaveRequestRoutingModule { }
