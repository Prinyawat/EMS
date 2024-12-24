import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaComponent } from './agenda.component';
import { AgendaRoutingModule } from './agenda-routing.module';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';


@NgModule({
    imports: [
        AgendaRoutingModule,
        CommonModule,
        TableModule,
        ToolbarModule,
        ButtonModule,
        FileUploadModule,

    ],
        declarations: [AgendaComponent]
})
export class AgendaComponentModule { }
