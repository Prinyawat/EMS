import { AdminLeaveRequestService } from '../../../shared/services/adminleaverequest.service';
import { LeaveRequestService } from '../../../shared/services/leaverequest.service';
import { CheckingService } from '../../../shared/services/checking.service';

import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table/table';
import * as FileSaver from 'file-saver';
import { Representative } from 'src/app/demo/api/customer';
import { AgendaData } from 'src/app/shared/models/agenda.model';
import { CheckingStatus } from 'src/app/shared/models/CheckingModel';

import { LeaveHalfStatus, LeaveStatusData, NotiAgenda } from 'src/app/shared/models/leaverequest.model';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-agenda-leave',
    templateUrl: './agenda-leave.component.html',
    styleUrls: ['./agenda-leave.component.scss'],
    providers: [MessageService, DatePipe, ConfirmationService]
})
export class AgendaLeaveComponent {

    startTimes: string = '';
    endTimes: string = '';
    isCustomLeave: boolean = false;
    timeDisable: boolean = false;

    InvselectedDates: boolean = false;
    InvselectedLeaveHalfStatus: boolean = false;
    InvselectedLeaveStatus: boolean = false;
    InvstartTime: boolean = false;
    InvendTime: boolean = false;
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
    agendaStatusId: string;
    adminCallBack: string = '';
    adminRejectedMess: string = '';

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

    @ViewChild('filter') filter!: ElementRef;

    constructor(private CheckingService: CheckingService,
        private LeaveRequestService: LeaveRequestService,
        private messageService: MessageService,
        private datePipe: DatePipe,
        private AdminLeaveRequestService: AdminLeaveRequestService,
        private confirmationService: ConfirmationService,
        private cdRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.cdRef.detectChanges();

        this.breadcrumbItems = [];
        this.breadcrumbItems.push({ label: 'ระบบบริหารจัดการทำงาน' });
        this.breadcrumbItems.push({ label: 'ประวัติคำขอการลา' });
        this.cols = [
            { field: 'firstName', header: 'ชื่อ', },
            { field: 'lastName', header: 'นามสกุล' },
            { field: 'checkingDate', header: 'วัน/เดือน/ปี' },
            { field: 'startTime', header: 'ลาช่วงเช้า' },
            { field: 'endTime', header: 'ลาช่วงบ่าย' },
            { field: 'leaveStatus', header: 'ประเภทการลา' },
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
                        value: item.leaveStatusData || ''
                    }));
                } else {
                    this.leaveRequestStatus = [];
                }
                this.updateDropdownOptionss();
            }
        });

        this.LeaveRequestService.getLeaveRequestHalfStatus().subscribe({
            next: (data) => {
                if (Array.isArray(data)) {
                    this.leaveRequestHalfStatus = data.map(item => ({
                        label: item.halfStatus,
                        value: item.leaveHalfId
                      }));
                    }
                }
            },
        );

        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
        this.NotiAgenda();
        this.updateFilteredAgendas();
        this.filteredAgendas = [...this.agendas];
    }

    filterMonthYear() {
        if (!this.selectedMonth || !this.selectedYear) {
            this.filteredAgendas = [...this.agendas, ...this.notiAgenda];
            return;
        }

        this.filteredAgendas = [
            ...this.notiAgenda.filter(noti => this.isMatchingMonthYear(noti.checkingDate))
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

    onSelectRequest(selectedDataAdmin: NotiAgenda) {

        this.display = true;

        this.selectedleaveRequestID = selectedDataAdmin.leaveRequestID;
        this.userID = selectedDataAdmin.userID;

        this.firstName = selectedDataAdmin.firstName;
        this.lastName = selectedDataAdmin.lastName;

        this.checkingDate = new Date(selectedDataAdmin.checkingDate);
        this.checkingDate.setHours(12, 0, 0, 0);

        this.startTime = new Date(`1970-01-01T${selectedDataAdmin.startTime}`);
        this.endTime = new Date(`1970-01-01T${selectedDataAdmin.endTime}`);

        const selectedLeave = this.leaveRequestHalfStatus.find(
            option => option.label === selectedDataAdmin.selectedLeaveHalfStatus
        );

        if (selectedLeave) {
            this.selectedLeaveHalfStatus = selectedLeave.value;
        }

        this.leaveStatuses = selectedDataAdmin.leaveStatus;
        this.additionalDescription = selectedDataAdmin.additionalDescription;
        this.cdRef.detectChanges();
    }

    onLeaveStatusChange(newStatus: any) {
        this.leaveStatuses = newStatus;
    }

    onLeaveHalfStatusChange(newHalfStatus: any, field: string) {
        this.selectedLeaveHalfStatus = newHalfStatus;
        this.setDefaultTime();
        switch (field) {
            case 'selectedLeaveHalfStatus':
                this.InvselectedLeaveHalfStatus = !this.selectedLeaveHalfStatus;
                break;
            case 'startTime':
                this.InvstartTime = !this.startTime || this.startTime === null;
                break;
            case 'endTime':
                this.InvendTime = !this.endTime || this.endTime === null;
                break;
        }
    }

    setDefaultTime() {

        if (this.selectedLeaveHalfStatus) {
            let start, end;

            switch (this.selectedLeaveHalfStatus) {
                case '47554f23-c29e-412c-8462-fcaf88facf97':
                    start = this.convertTimeToDate('08:30');
                    end = this.convertTimeToDate('12:00');
                    this.timeDisable = true;
                    break;

                case '08e9cdf5-9a34-48b5-b039-575aee088e22':
                    start = this.convertTimeToDate('13:00');
                    end = this.convertTimeToDate('17:30');
                    this.timeDisable = true;
                    break;

                case '6f203081-6a58-42c0-879f-86e8d53227db':
                    start = this.convertTimeToDate('08:30');
                    end = this.convertTimeToDate('17:30');
                    this.timeDisable = true;
                    break;

                case '94d2ff39-6c98-40f2-a5fd-ad5583acd8ee':
                    start = null;
                    end = null;
                    this.timeDisable = false;
                    break;

                default:
                    start = null;
                    end = null;
                    break;
            }

            this.startTime = start;
            this.endTime = end;
        }
    }

    onValueChange(field: string) {
    }

    convertTimeToDate(timeStr: string): Date | null {
        if (!timeStr) return null;

        const [hours, minutes] = timeStr.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) return null;

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    onUserSelect(selectedDataAdmin: NotiAgenda) {
        this.display = true;

        this.selectedleaveRequestID = selectedDataAdmin.leaveRequestID;
        this.userID = selectedDataAdmin.userID;

        this.firstName = selectedDataAdmin.firstName;
        this.lastName = selectedDataAdmin.lastName;

        this.checkingDate = new Date(selectedDataAdmin.checkingDate);
        this.checkingDate.setHours(12, 0, 0, 0);

        this.startTime = new Date(`1970-01-01T${selectedDataAdmin.startTime}`);
        this.endTime = new Date(`1970-01-01T${selectedDataAdmin.endTime}`);

        const selectedLeave = this.leaveRequestHalfStatus.find(
            option => option.label === selectedDataAdmin.selectedLeaveHalfStatus
        );

        if (selectedLeave) {
            this.selectedLeaveHalfStatus = selectedLeave.value;
        }

        this.leaveStatuses = selectedDataAdmin.leaveStatus;
        this.additionalDescription = selectedDataAdmin.additionalDescription;
        this.agendaStatusId = selectedDataAdmin.agendaStatusId;
        this.adminCallBack = selectedDataAdmin.adminMessageBack;
        this.cdRef.detectChanges();
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

    createDateFromTime(timeStr: string): Date {
        return new Date(`1970-01-01T${timeStr}`);
    }

    updateFilteredAgendas() {
        this.filteredAgendas = [
            ...this.notiAgenda
        ];
    }

    updateDropdownOptionss() {
        this.updateDropdownOptions = [
            { label: 'เลือกทั้งหมด', value: null },
            ...(Array.isArray(this.leaveRequestStatus) ? this.leaveRequestStatus : [])
        ];
    }

    filterDropDown(selectedStatus: string | null) {
        if (selectedStatus === null || selectedStatus === 'เลือกทั้งหมด') {
            this.filteredAgendas = [...this.notiAgenda];
        } else {
            this.filteredAgendas = [
                ...(this.notiAgenda.filter(noti => noti.leaveStatus === selectedStatus))
            ];
        }
    }

    getStatusColor(label: string | null): string {
        if (!label) {
            return 'gray';
        }

        switch (label.toLowerCase()) {
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

    AdminChecking(): boolean {
        return this.UserID !== '42cfb3be-fa01-499a-95af-fa0a879fb0ad';
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const headers = this.cols.map(col => col.header);

            const dataToExport = this.selectedAgendas.map(item => {
                const row: any = {};

                this.cols.forEach(col => {
                    if (col.field === 'startTime') {
                        row['ลาช่วงเช้า'] = item.startTime ? this.formatExcelTime(item.startTime) : '';
                    } else if (col.field === 'endTime') {
                        row['ลาช่วงบ่าย'] = item.endTime ? this.formatExcelTime(item.endTime) : '';
                    } else if (col.field === 'leaveStatus') {
                        row['ประเภทการลา'] = (item.leaveStatus || '');
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

    formatExcelTime(time: Date | string): string {
        let dateObj: Date;
        if (typeof time === 'string') {
          dateObj = new Date(`1970-01-01T${time}`);
        } else {
          dateObj = time;
        }
        return dateObj.toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }) + " น.";
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

    confirmDenyRequest(event: Event, leaveRequestID: string) {
        this.confirmationService.confirm({
            key: 'confirmDenyToast',
            target: event.target || new EventTarget(),
            message: 'ต้องการปฏิเสธคำขอลาจริงใช่ไหม',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.onDenyRequest(leaveRequestID);
            },
        });
    }

    onDenyRequest(leaveRequestID: string) {
        const requestData = { leaveRequestID };
        this.AdminLeaveRequestService.deleteLeaveRequest(requestData).subscribe(response => {
            this.messageService.add({
                key: 'DeleteSucess',
                severity: 'success',
                summary: 'ลบสำเร็จ',
                detail: 'คุณได้ทำการลบคำขอแล้ว',
            });
            this.NotiAgenda();
            this.display = false;
        });
    }

    onApprove() {
        const agendaApprove = {
            approveStatusId: this.approveStatusId,
            leaveRequestID: this.selectedleaveRequestID,

        };
        this.AdminLeaveRequestService.saveAgendaApprove(agendaApprove).subscribe(
            response => {
                console.log(agendaApprove);
                this.messageService.add({
                    key: 'DeleteSucess',
                    severity: 'success',
                    summary: 'อนุมัติสำเร็จ',
                    detail: 'คุณได้ทำการอนุมัติคำขอแล้ว',
                });
                this.NotiAgenda();
                this.display = false;
            }
        );
    }

    onReject() {
        const agendaApprove = {
            rejectStatusId: this.rejectStatusId,
            leaveRequestID: this.selectedleaveRequestID,
            adminMessageBack: this.adminRejectedMess,
        };
        this.AdminLeaveRequestService.saveAgendaReject(agendaApprove).subscribe(
            response => {
                console.log(agendaApprove);
                this.messageService.add({
                    key: 'DeleteSucess',
                    severity: 'success',
                    summary: 'อนุมัติสำเร็จ',
                    detail: 'คุณได้ทำการปฏิเสธคำขอแล้ว',
                });
                this.NotiAgenda();
                this.display = false;
            }
        );
    }

    onUpdate() {
        const agendaUpdate = {
            leaveRequestID: this.selectedleaveRequestID,
            checkingDate: this.checkingDate.toLocaleDateString("en-CA"),
            startTime: this.formatTime(this.startTime),
            endTime: this.formatTime(this.endTime),
            selectedLeaveHalfStatus: this.selectedLeaveHalfStatus,
            leaveStatuses: this.leaveStatuses,
            additionalDescription: this.additionalDescription,
            agendaStatusesID: this.agendaStatusId
        };

        this.AdminLeaveRequestService.saveAgendaUpdate(agendaUpdate).subscribe({
            next: (response) => {
                this.messageService.add({
                    key: 'DeleteSucess',
                    severity: 'info',
                    summary: 'อัพเดทสำเร็จ',
                    detail: 'คุณได้ทำการอัพเดทคำขอแล้ว',
                });
                this.NotiAgenda();
                this.display = false;
            },
            error: (err) => {
                if (err.error && err.error.message === "Duplicate") {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'แจ้งเตือน',
                        detail: 'ปฏิทินลาที่เลือก ซ้ำ!'
                    });
                }
            },
        });
    }

    formatTime(time: string | Date): string {
        if (!time) return '';
        if (typeof time === 'string') {
            return time.slice(0, 5);
        }
        const date = new Date(time);
        return date.toTimeString().slice(0, 5);
      }

}
