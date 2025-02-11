import { CheckingService } from './../../../shared/services/checking.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Table, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import * as FileSaver from 'file-saver';
import { HeaderAgenda, NotiAgenda } from 'src/app/shared/models/leaverequest.model';


@Component({
    selector: 'app-admin-agenda',
    templateUrl: './admin-agenda.component.html',
    providers: [MessageService]

})
export class AdminAgendaComponent implements OnInit {

    expandedRows = {};
    breadcrumbItems: MenuItem[] = [];

    AgendaDatas: NotiAgenda[] = [];
    HeaderData: HeaderAgenda[] = [];

    @ViewChild('filter') filter!: ElementRef;
    constructor(private CheckingService: CheckingService

    ) { }

    ngOnInit() {
        this.fetchAgenda();

        this.CheckingService.getAgendaHeader().subscribe({
            next: (data) => {
                if (Array.isArray(data)) {
                    this.HeaderData = data
                }
            }
        });
    }

    fetchAgenda() {
        this.CheckingService.getNotiAgenda().subscribe({
            next: (AgendaDatas: NotiAgenda[]) => {
                this.AgendaDatas = AgendaDatas;
            }
        });
    }

    onRowExpand(event: TableRowExpandEvent) {
        this.expandedRows[event.data.GroupName] = true;
    }

    onRowCollapse(event: TableRowCollapseEvent) {
        delete this.expandedRows[event.data.GroupName];
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

}
