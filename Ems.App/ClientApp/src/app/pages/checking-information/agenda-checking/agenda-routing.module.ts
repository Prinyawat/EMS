import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgendaComponent } from './agenda.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AgendaComponent }
    ])],
    exports: [RouterModule]
})
export class AgendaRoutingModule { }
