import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgendaLeaveComponent } from './agenda-leave.component';



@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AgendaLeaveComponent }
    ])],
    exports: [RouterModule]
})
export class AgendaLeaveRoutingModule { }
