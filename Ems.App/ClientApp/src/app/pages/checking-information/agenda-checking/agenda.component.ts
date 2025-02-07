import { LeaveRequestService } from '../../../shared/services/leaverequest.service';
import { CheckingService } from './../../../shared/services/checking.service';

import { Component, ElementRef, ViewChild} from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table/table';
import * as FileSaver from 'file-saver';
import { Representative } from 'src/app/demo/api/customer';
import { AgendaData} from 'src/app/shared/models/agenda.model';
import { CheckingStatus } from 'src/app/shared/models/CheckingModel';

import { LeaveStatusData, NotiAgenda } from 'src/app/shared/models/leaverequest.model';
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

    selectedItem: string | null = null;

    selectedLeaveStatus: LeaveStatusData | null = null;

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

    notiAgenda: NotiAgenda[] = [];

    agendas: AgendaData[] = [];

    filteredAgendas: (AgendaData | NotiAgenda)[] = [];

    cols: any[];

    exportColumns: any[];

    representatives: Representative[] = [];

    rowGroupMetadata: any;

    @ViewChild('filter') filter!: ElementRef;

    constructor(private CheckingService: CheckingService,
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
            { field: 'selectedLeaveHalfStatus', header: 'กรณีลา' },
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
                        value: item.leaveStatusData  || ''
                    }));
                } else {
                    this.leaveRequestStatus = [];
                    console.error('Expected array, but received:', data);
                }
                console.log(this.leaveRequestStatus);
                this.updateDropdownOptionss();
            }
        });

        this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
        this.fetchAgenda();
        this.NotiAgenda();
        this.updateFilteredAgendas();
    }

    fetchAgenda() {
        this.CheckingService.getAgendas().subscribe({
            next: (data: AgendaData[]) => {
                this.agendas = data.map(agenda => ({
                    ...agenda,
                    checkingDate: new Date(agenda.checkingDate)
                }));
                this.updateFilteredAgendas();
            }
        });
    }

    convertThaiDateToJSDate(thaiDateStr: string): Date | null {
        const [day, month, year] = thaiDateStr.trim().split('/').map(Number);
        const gregorianYear = year - 543;
        const formattedDate = new Date(gregorianYear, month - 1, day);
        return isNaN(formattedDate.getTime()) ? null : formattedDate;
      }

    NotiAgenda() {
        this.CheckingService.getNotiAgenda().subscribe({
            next: (data: NotiAgenda[]) => {
                console.log(data);
                if (data && Array.isArray(data)) {
                    this.notiAgenda = data.flatMap(agenda => {

                        let checkingDates: string[];

                        if (agenda.checkingDate instanceof Date) {
                            checkingDates = [agenda.checkingDate.toISOString()];
                        } else if (typeof agenda.checkingDate === 'string') {
                            checkingDates = (agenda.checkingDate as string).split(',');
                        } else {
                            checkingDates = [];
                        }
                        return checkingDates.map(date => ({
                            ...agenda,
                            checkingDate: this.convertThaiDateToJSDate(date),
                            startTime: agenda.startTime,
                            endTime: agenda.endTime,
                            selectedLeaveHalfStatus: agenda.selectedLeaveHalfStatus,
                            leaveStatus: agenda.leaveStatus
                        }));
                    });
                    this.updateFilteredAgendas();
                } else {
                }
            }
        });
    }

    updateFilteredAgendas() {
        this.filteredAgendas = [
            ...this.agendas,
            ...this.notiAgenda
        ];
    }

    updateDropdownOptionss() {
        this.updateDropdownOptions = [
            { label: 'เลือกสถานะ', value: null },
            ...(Array.isArray(this.workStatus) ? this.workStatus : []),
            ...(Array.isArray(this.leaveRequestStatus) ? this.leaveRequestStatus : [])
        ];
    }

    filterDropDown(selectedStatus: string | null) {
        if (selectedStatus === null) {
            this.filteredAgendas = [...this.agendas, ...this.notiAgenda];
        } else {
            this.filteredAgendas = this.agendas.filter(agenda => agenda.checkingStatus === selectedStatus);
            this.filteredAgendas = [
                ...this.filteredAgendas,
                ...(this.notiAgenda.filter(noti => noti.leaveStatus === selectedStatus))
            ];
        }
        // console.log('Filtered Agendas:', this.filteredAgendas);
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
                    if (col.field === 'checkIn' || col.field === 'startTime') {
                        row['เวลาเข้างาน'] = (item.checkIn || '') + '' + (item.startTime || '');
                    } else if (col.field === 'checkOut' || col.field === 'endTime') {
                        row['เวลาออกงาน'] = (item.checkOut || '') + '' + (item.endTime || '');
                    } else if (col.field === 'checkingStatus' || col.field === 'leaveStatus') {
                        row['สถานะ'] = (item.checkingStatus || '') + ' / ' + (item.leaveStatus || '');
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
