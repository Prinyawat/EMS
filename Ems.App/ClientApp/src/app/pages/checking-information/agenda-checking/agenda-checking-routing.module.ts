import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgendCheckingComponent } from './agenda-checking.component';



@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AgendCheckingComponent }
    ])],
    exports: [RouterModule]
})
export class AgendaCheckingRoutingModule { }
