import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { AdminAgendaComponent } from './admin-agenda.component';
import { ToolbarModule } from 'primeng/toolbar';
import { TabMenuModule } from 'primeng/tabmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AdminAgendaRoutingModule } from './admin-agenda-routing.module';


@NgModule({
    imports: [
        AdminAgendaRoutingModule,
        CommonModule,
        TableModule,
        ToolbarModule,
        ButtonModule,
        DialogModule,
        BreadcrumbModule,
        InputTextModule,
        ToastModule,
        DropdownModule,
        TabMenuModule,
        TieredMenuModule,
        MultiSelectModule,
    ],
    declarations: [AdminAgendaComponent,],
    providers: [ConfirmationService]
})
export class AdminAgendaModule { }
