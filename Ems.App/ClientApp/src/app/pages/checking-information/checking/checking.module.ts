import { NgModule } from '@angular/core';
import { CheckingRoutingModule } from './checking-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { CheckingComponent } from './checking.component';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { InputDemoRoutingModule } from 'src/app/demo/components/uikit/input/inputdemo-routing.module';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';



@NgModule({
    imports: [
        CheckingRoutingModule,
        CommonModule,
        FormsModule,
        InputDemoRoutingModule,
        CalendarModule,
        InputTextModule,
        InputTextareaModule,
        RadioButtonModule,
        DialogModule,
        ToastModule,
        ConfirmPopupModule,
        InputGroupModule,
        InputGroupAddonModule,
    ],
        declarations: [CheckingComponent]
})
export class CheckingComponentModule { }
