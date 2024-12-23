import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CheckingComponent } from './checking.component';



@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CheckingComponent }
    ])],
    exports: [RouterModule]
})
export class CheckingRoutingModule { }
