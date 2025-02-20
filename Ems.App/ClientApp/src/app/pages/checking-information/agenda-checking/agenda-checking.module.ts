import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { TabMenuModule } from 'primeng/tabmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { AgendCheckingComponent } from './agenda-checking.component';
import { AgendaCheckingRoutingModule } from './agenda-checking-routing.module';

@NgModule({
    imports: [
        AgendaCheckingRoutingModule,
        CommonModule,
        TableModule,
        ToolbarModule,
        ButtonModule,
        FileUploadModule,
        DialogModule,
        BreadcrumbModule,
        InputTextModule,
        ToastModule,
        DropdownModule,
        TabMenuModule,
        TieredMenuModule,
        MultiSelectModule,
        InputTextareaModule,
        OverlayPanelModule,
        ConfirmPopupModule,
        CalendarModule,
        FormsModule,

    ],
        declarations: [AgendCheckingComponent]
})
export class AgendaCheckingComponentModule { }
