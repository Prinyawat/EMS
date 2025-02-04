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
import { CheckingStatus } from 'src/app/shared/models/CheckingModel';
@Component({
    selector: 'app-agenda',
    templateUrl: './agenda.component.html',
    providers: [MessageService]
})
export class AgendaComponent {

    private statusColorMap = {
        'e3312023-8545-4e9e-83bc-ab9576ba8307': 'purple',
        '8701d6f4-5973-4f8e-8b91-5ded391e357f': '#4D96FF',
        'cbeb053e-5c39-4c6c-9439-24c86ca56cfd': '#FFD93D',
        '043c1da7-fa3e-4466-85b6-b2cc40a500c3': '#8D99AE',
        '44467da9-d2fd-4293-bbb1-d8ccb7dae8f7': '#F39AC4'
    };

    value: any = null;

    updateDropdownOptions: { label: string, value: string }[] = [];

    selectedItem: CheckingStatus | null = null;

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
            { field: 'firstName', header: 'ชื่อ',},
            { field: 'lastName', header: 'นามสกุล' },
            { field: 'checkingDate', header: 'วัน/เดือน/ปี' },
            { field: 'checkIn', header: 'เวลาเข้างาน' },
            { field: 'checkOut', header: 'เวลาออกงาน' },
            { field: 'checkingStatus', header: 'สถานะ' },
        ];

        this.CheckingService.getCheckinStatus().subscribe({
            next: (data) => {
                if (Array.isArray(data)) {
                    this.workStatus = data.map(item => ({
                        label: item.statuses || '',
                        value: item.statuses || ''
                    }));
                    this.updateDropdownOptionss();
                }
            }
        });

        this.LeaveRequestService.getLeaveRequestStatus().subscribe({
            next: (data) => {
                if (Array.isArray(data)) {
                    this.leaveRequestStatus = data.map(item => ({
                        label: item.leaveStatusData || '',
                        value: item.leaveStatusId || ''
                    }));
                }else{
                    this.leaveRequestStatus = [];
                }
                this.updateDropdownOptionss();
                console.log('Leave Status Data:', this.leaveRequestStatus);
            }
        });

        this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
        this.fetchAgenda();
    }

    fetchAgenda() {
        this.CheckingService.getAgendas().subscribe({
            next: (data: AgendaData[]) => {
                this.agendas = data.map(agenda => ({
                    ...agenda,
                    checkingDate: new Date(agenda.checkingDate)
                }));
                this.filteredAgendas = [...this.agendas];
            }
        });
    }

    updateDropdownOptionss() {
        this.updateDropdownOptions = [
            { label: 'เลือกสถานะ', value: null },
            ...this.workStatus,
            ...this.leaveRequestStatus

        ];
    }

    getStatusColor(label: string | null): string {
        if (!label) {
            return 'gray';
        }

        switch (label.toLowerCase()) {
            case 'ปฏิบัติงานที่สำนักงาน':
                return 'green';
            case 'ปฏิบัติงานจากที่บ้าน':
                return 'blue';
            case 'ลาป่วย':
                return 'purple';
            case 'ลาศึกษา':
                return '#4D96FF';
            case 'ลาพักร้อน':
                return '#FFD93D';
            case 'ลากิจส่วนตัว':
                return '#8D99AE';
            case 'ลาคลอด':
                return '#F39AC4';
            default:
                return 'gray';
        }
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const headers = this.cols.map(col => col.header);

            const dataToExport = this.selectedAgendas.map(item => {
                const row: any = {};
                this.cols.forEach(col => {
                        row[col.header] = item[col.field];
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
