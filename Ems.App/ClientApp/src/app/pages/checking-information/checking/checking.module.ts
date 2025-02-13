import { NgModule } from '@angular/core';
import { CheckingRoutingModule } from './checking-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { CheckingComponent } from './checking.component';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { InputDemoRoutingModule } from 'src/app/demo/components/uikit/input/inputdemo-routing.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';



@NgModule({
    imports: [
        CheckingRoutingModule,
        CommonModule,
        FormsModule,
        InputDemoRoutingModule,
        CalendarModule,
        InputTextModule,
        TextareaModule,
        RadioButtonModule,
        DialogModule,
        ToastModule,
        ConfirmPopupModule,
        InputGroupModule,
        InputGroupAddonModule,
        BreadcrumbModule,
        TableModule,
        DropdownModule,
        MessagesModule,
        MessageModule,
        TagModule,
        ButtonModule
    ],
        declarations: [CheckingComponent]
})
export class CheckingComponentModule { }
