import { LeaveRequestService } from '../../../shared/services/leaverequest.service';
import { CheckingService } from './../../../shared/services/checking.service';

import { Component, ElementRef, ViewChild} from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table/table';
import { customeragenda } from 'src/app/pages/checking-information/customer-checking/customers-checking';
import * as FileSaver from 'file-saver';
import { Representative } from 'src/app/demo/api/customer';
import { AgendaData} from 'src/app/shared/models/agenda.model';
import { AgendaService } from 'src/app/shared/services/agenda.service';
@Component({
    selector: 'app-agenda',
    templateUrl: './agenda.component.html',
    providers: [MessageService]
})
export class AgendaComponent {

    filteredAgendas: AgendaData[] = [];

    allStatusOptions: any[] = [];

    leaveStatus: any[];

    selectedAgendas = [];

    workStatus: any[] = [];

    breadcrumbItems: MenuItem[] = [];

    statuses: any[];

    monthOfYear: any[];

    selectedMonths: any[];

    leaveRequestStatus: any[];

    loading: boolean = true;

    agendas: AgendaData[] = [];

    cols: any[];

    exportColumns: any[];

    representatives: Representative[] = [];

    rowGroupMetadata: any;

    @ViewChild('filter') filter!: ElementRef;

    constructor(private AgendaService: AgendaService,
        private CheckingService: CheckingService,
        private LeaveRequestService: LeaveRequestService,
        private messageService: MessageService) { }

    ngOnInit() {
        this.breadcrumbItems = [];
        this.breadcrumbItems.push({ label: 'Check Information' });
        this.breadcrumbItems.push({ label: 'Checking' });
        this.breadcrumbItems.push({ label: 'User Agenda' });

        this.cols = [
            { field: 'firstName', header: 'firstName',},
            { field: 'lastName', header: 'lastName' },
            { field: 'monthName', header: 'month' },
            { field: 'checkingDate', header: 'checkingDate' },
            { field: 'checkIn', header: 'checkIn' },
            { field: 'checkOut', header: 'checkOut' },
            { field: 'checkingStatus', header: 'checkingStatus' },
        ];

        this.statuses = [
            {label: 'WorkIn', value: 'workin'},
            {label: 'WorkFromHome', value: 'workfromhome'}
        ]

        this.monthOfYear = [
            {label: 'January', value: 'january'},
            {label: 'February', value: 'february'},
            {label: 'March', value: 'march'},
            {label: 'April', value: 'april'},
            {label: 'May', value: 'may'},
            {label: 'June', value: 'june'},
            {label: 'July', value: 'july'},
            {label: 'August', value: 'august'},
            {label: 'September', value: 'september'},
            {label: 'October', value: 'october'},
            {label: 'November', value: 'november'},
            {label: 'December', value: 'december'}
        ]

        this.leaveRequestStatus = [
            { label: 'SickLeave', value: 'sickleave' },
            { label: 'StudyLeave', value: 'studyleave' },
            { label: 'AnnualLeave', value: 'annualleave' },
            { label: 'PersonalLeave', value: 'personalleave' },
            { label: 'MaternityLeave', value: 'maternityleave'},
        ];

        this.allStatusOptions = [
            ...this.statuses,
            ...this.leaveRequestStatus
          ];

        this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
        this.fetchAgenda();
        this.leaveStatus = this.LeaveRequestService.getLeaveRequestStatus();
    }

    fetchAgenda() {
        this.CheckingService.getAgendas().subscribe({
            next: (data: AgendaData[]) => {
                this.agendas = data.map(agenda => ({
                    ...agenda,
                    checkingDate: new Date(agenda.checkingDate), // แปลง checkingDate เป็น Date object
                    monthName: this.getMonthNameFromDate(agenda.checkingDate) // แปลง checkingDate เป็นชื่อเดือน
                }));

                // อัปเดต filteredAgendas
                this.filteredAgendas = [...this.agendas];
            },
            error: err => {
                console.error('Error fetching agendas:', err);
            }
        });
    }

    getStatusColor(status: string | null): string {
        if (!status) {
            return 'transparent';
        }
        switch (status.toLowerCase()) {
            case 'workin':
                return 'green';
            case 'workfromhome':
                return 'blue';
            case 'sickleave':
                return 'purple';
            case 'studyleave':
                return '#4D96FF';
            case 'annualleave':
                    return '#FFD93D';
            case 'personalleave':
                return '#8D99AE';
            case 'maternityleave':
                return '#F39AC4';
            default:
                return 'gray';
        }
    }

    getMonthNameFromDate(date: Date | string | null | undefined): string {
        if (!date) return 'Invalid date';

        try {
            const dateStr = (date instanceof Date) ? date.toISOString() : date;

            const parts = dateStr.split('T')[0].split('-');
            if (parts.length !== 3) return 'Invalid date';

            const day = parseInt(parts[2], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[0], 10);

            const formattedDate = new Date(year, month, day);
            if (isNaN(formattedDate.getTime())) return 'Invalid date';

            const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(formattedDate);
            return monthName;
        } catch (error) {
            console.error('Error converting date:', error);
            return 'Invalid date';
        }
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const headers = this.cols.map(col => col.header);

            const dataToExport = this.selectedAgendas.map(item => {
                const row: any = {};
                this.cols.forEach(col => {
                    if (col.field === 'month') {
                        row[col.header] = this.getMonthNameFromDate(item['checkingDate']);
                    } else {
                        row[col.header] = item[col.field];
                    }
                });
                return row;
            });

            const worksheet = xlsx.utils.json_to_sheet(dataToExport, { header: headers });
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });

            this.saveAsExcelFile(excelBuffer, "user_agendas");
        });
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
