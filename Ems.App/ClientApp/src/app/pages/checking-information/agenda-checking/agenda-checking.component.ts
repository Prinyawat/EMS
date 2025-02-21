import { AdminLeaveRequestService } from '../../../shared/services/adminleaverequest.service';
import { LeaveRequestService } from '../../../shared/services/leaverequest.service';
import { CheckingService } from '../../../shared/services/checking.service';

import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table/table';
import * as FileSaver from 'file-saver';
import { Representative } from 'src/app/demo/api/customer';
import { AgendaData } from 'src/app/shared/models/agenda.model';
import { CheckingStatus } from 'src/app/shared/models/CheckingModel';

import { LeaveHalfStatus, LeaveStatusData, NotiAgenda } from 'src/app/shared/models/leaverequest.model';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-agenda-checking',
    templateUrl: './agenda-checking.component.html',
    providers: [MessageService, DatePipe, ConfirmationService]
})
export class AgendCheckingComponent {

    selectedDataAdmin: [] = [];

    selectedleaveRequestID: string = '';
    userID: string = '';
    firstName: string = '';
    lastName: string = '';
    checkingDate: Date = new Date();
    startTime!: Date ;
    endTime!: Date;
    selectedLeaveHalfStatus: string = '';
    leaveStatuses: string = '';
    additionalDescription: string = '';

    formattedDate: string = '';
    value: any = null;
    dates: string[] = [];
    loading: boolean = false;

    display: boolean = false;
    selectedAgenda: any;
    requests: any[] = [];

    pendingStatusId: string;
    approveStatusId = '2972bc3a-2d3a-422c-bd03-a2dbd34a2a45';
    rejectStatusId = 'be7eef8e-1ad6-4503-a88a-f9a7b1cba773';


    leaveRequestID: string;
    isAdmin: boolean = false;
    adminID = '42cfb3be-fa01-499a-95af-fa0a879fb0ad';
    UserID: string;

    selectedAgendas = [];
    selectedMonths: any[];
    selectedItem: string | null = null;
    selectedLeaveStatus: LeaveStatusData | null = null;

    updateDropdownOptions: { label: string, value: string }[] = [];
    allStatusOptions: any[] = [];
    leaveStatus: any[];
    leaveRequestHalfStatus: any[];

    breadcrumbItems: MenuItem[] = [];
    workStatus: any[] = [];

    leaveRequestStatus: any[];
    statuses: any[];
    monthOfYear: any[];

    agendas: AgendaData[] = [];
    notiAgenda: NotiAgenda[] = [];
    filteredAgendas: (AgendaData | NotiAgenda)[] = [];

    cols: any[];
    exportColumns: any[];
    representatives: Representative[] = [];
    rowGroupMetadata: any;

    @ViewChild('filter') filter!: ElementRef;

    filteredMonthYear: any[] = [];
    selectedMonth: number;
    months = [
        { label: 'มกราคม', value: 1 },
        { label: 'กุมภาพันธ์', value: 2 },
        { label: 'มีนาคม', value: 3 },
        { label: 'เมษายน', value: 4 },
        { label: 'พฤษภาคม', value: 5 },
        { label: 'มิถุนายน', value: 6 },
        { label: 'กรกฎาคม', value: 7 },
        { label: 'สิงหาคม', value: 8 },
        { label: 'กันยายน', value: 9 },
        { label: 'ตุลาคม', value: 10 },
        { label: 'พฤศจิกายน', value: 11 },
        { label: 'ธันวาคม', value: 12 }
    ];

    selectedYear: number;
    years = [
        { label: '2026', value: 2026 },
        { label: '2025', value: 2025 },
        { label: '2024', value: 2024 },
    ];

    constructor(private CheckingService: CheckingService,
        private LeaveRequestService: LeaveRequestService,
        private messageService: MessageService,
        private datePipe: DatePipe,
        private AdminLeaveRequestService: AdminLeaveRequestService,
        private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.breadcrumbItems = [];
        this.breadcrumbItems.push({ label: 'ระบบบริหารจัดการทำงาน' });
        this.breadcrumbItems.push({ label: 'ประวัติบันทึกเวลาเข้างาน' });
        this.cols = [
            { field: 'firstName', header: 'ชื่อ', },
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

        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
        this.fetchAgenda();
        this.NotiAgenda();
        this.updateFilteredAgendas();
    }

    filterMonthYear() {
        if (!this.selectedMonth || !this.selectedYear) {
            this.filteredAgendas = [...this.agendas];
            return;
        }

        this.filteredAgendas = [
            ...this.agendas.filter(agen => this.isMatchingMonthYear(agen.checkingDate))
        ];
    }

    isMatchingMonthYear(checkingDate: Date): boolean {
        let date = new Date(checkingDate);
        if (isNaN(date.getTime())) {
            console.warn("Invalid date:", checkingDate);
            return false;
        }
        return date.getMonth() + 1 === this.selectedMonth && date.getFullYear() === this.selectedYear;
    }

    formatDateToThai(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        };
        const thaiDate = new Intl.DateTimeFormat('th-TH', options).format(date);
        const splitDate = thaiDate.split(' ');
        const yearInEnglish = new Date(date).getFullYear();

        return `${splitDate[0]} ${splitDate[1]} ${yearInEnglish}`;
    }

    parseTime(timeString: string): Date {
        const [time, modifier] = timeString.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) {
            hours += 12;
        } else if (modifier === "AM" && hours === 12) {
            hours = 0;
        }

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
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
        const gregorianYear = year;
        const formattedDate = new Date(gregorianYear, month - 1, day);
        return isNaN(formattedDate.getTime()) ? null : formattedDate;
    }

    NotiAgenda() {
        this.CheckingService.getNotiAgenda().subscribe({
            next: (data: NotiAgenda[]) => {
                console.log(data);
                if (data.length > 0) {
                    if (data[0].userID) {
                        this.UserID = data[0].userID;
                    }
                }

                if (this.UserID === '42cfb3be-fa01-499a-95af-fa0a879fb0ad') {
                    this.notiAgenda = data.flatMap(agenda => {
                        console.log("Admin:", data);
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
                    this.notiAgenda = data.flatMap(agenda => {
                        if (agenda.agendaStatusId) {
                            this.pendingStatusId = agenda.agendaStatusId;
                        }
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
                            leaveStatus: agenda.leaveStatus,
                            pendingStatusId: agenda.agendaStatusId
                        }));
                    });
                    this.updateFilteredAgendas();
                }
            }
        });
    }

    updateFilteredAgendas() {
        this.filteredAgendas = [
            ...this.agendas,
        ];
    }

    updateDropdownOptionss() {
        this.updateDropdownOptions = [
            { label: 'เลือกทั้งหมด', value: null },
            ...(Array.isArray(this.workStatus) ? this.workStatus : []),
        ];
    }

    filterDropDown(selectedStatus: string | null) {
        if (selectedStatus === null || selectedStatus === 'เลือกทั้งหมด') {
            this.filteredAgendas = [...this.agendas];
        } else {
            this.filteredAgendas = this.agendas.filter(agenda => agenda.checkingStatus === selectedStatus);
        }
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
                    if (col.field === 'checkIn') {
                        row['เวลาเข้างาน'] = (item.checkIn);
                    } else if (col.field === 'checkOut') {
                        row['เวลาออกงาน'] = (item.checkOut);
                    } else if (col.field === 'checkingStatus') {
                        row['สถานะ'] = (item.checkingStatus);
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
}
