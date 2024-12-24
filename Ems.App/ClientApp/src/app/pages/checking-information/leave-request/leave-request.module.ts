import { NgModule } from '@angular/core';
import { LeaveRequestComponent } from './leave-request.component';
import { LeaveRequestRoutingModule } from './leave-request-routing.module';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
    imports: [
        LeaveRequestRoutingModule,
        CommonModule,
        InputTextModule,
        CalendarModule,
        InputTextareaModule,
        FileUploadModule,
        ConfirmPopupModule,
        ToastModule,
        MenuModule,
        BreadcrumbModule,

    ],
        declarations: [LeaveRequestComponent]
})
export class LeaveRequestComponentModule { }
