import { NgModule } from '@angular/core';
import { LeaveRequestComponent } from './leave-request.component';
import { LeaveRequestRoutingModule } from './leave-request-routing.module';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
@NgModule({
    imports: [
        LeaveRequestRoutingModule,
        CommonModule,
        InputTextModule,
        CalendarModule,
        TextareaModule,
        FileUploadModule,
        ConfirmPopupModule,
        ToastModule,
        MenuModule,
        BreadcrumbModule,
        FormsModule,
        DropdownModule,
        RadioButtonModule,
        TagModule,
        DialogModule,
        OverlayPanelModule
    ],
        declarations: [LeaveRequestComponent]
})
export class LeaveRequestComponentModule { }
