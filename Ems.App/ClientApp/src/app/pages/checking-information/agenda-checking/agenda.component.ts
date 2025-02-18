import { AdminLeaveRequestService } from './../../../shared/services/adminleaverequest.service';
import { LeaveRequestService } from '../../../shared/services/leaverequest.service';
import { CheckingService } from './../../../shared/services/checking.service';

import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table/table';
import * as FileSaver from 'file-saver';
import { Representative } from 'src/app/demo/api/customer';
import { AgendaData } from 'src/app/shared/models/agenda.model';
import { CheckingStatus } from 'src/app/shared/models/CheckingModel';

import { LeaveStatusData, NotiAgenda } from 'src/app/shared/models/leaverequest.model';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-agenda',
    templateUrl: './agenda.component.html',
    providers: [MessageService, DatePipe, ConfirmationService]
})
export class AgendaComponent {

    private statusColorMap = {
        'e3312023-8545-4e9e-83bc-ab9576ba8307': 'purple',
        '8701d6f4-5973-4f8e-8b91-5ded391e357f': '#4D96FF',
        'cbeb053e-5c39-4c6c-9439-24c86ca56cfd': '#FFD93D',
        '043c1da7-fa3e-4466-85b6-b2cc40a500c3': '#8D99AE',
        '44467da9-d2fd-4293-bbb1-d8ccb7dae8f7': '#F39AC4'
    };

    selectedDataAdmin: [] = [];

    selectedleaveRequestID: string = '';
    userID: string = '';
    firstName: string = '';
    lastName: string = '';
    checkingDate: Date = new Date();
    startTime: string;
    endTime: string;
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

    constructor(private CheckingService: CheckingService,
        private LeaveRequestService: LeaveRequestService,
        private messageService: MessageService,
        private datePipe: DatePipe,
        private AdminLeaveRequestService: AdminLeaveRequestService,
        private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.breadcrumbItems = [];
        this.breadcrumbItems.push({ label: 'Check Information' });
        this.breadcrumbItems.push({ label: 'แดชบอร์ดข้อมูล' });

        this.cols = [
            { field: 'firstName', header: 'ชื่อ', },
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
                        value: item.leaveStatusData || ''
                    }));
                } else {
                    this.leaveRequestStatus = [];
                }
                this.updateDropdownOptionss();
            }
        });
        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
        this.fetchAgenda();
        this.NotiAgenda();
        this.updateFilteredAgendas();
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

        this.startTime = selectedDataAdmin.startTime;
        this.endTime = selectedDataAdmin.endTime;

        this.selectedLeaveHalfStatus = selectedDataAdmin.selectedLeaveHalfStatus;
        this.leaveStatuses = selectedDataAdmin.leaveStatus;
        this.additionalDescription = selectedDataAdmin.additionalDescription;
    }

    onUserSelect(selectedDataAdmin: NotiAgenda) {
        this.display = true;

        this.selectedleaveRequestID = selectedDataAdmin.leaveRequestID;
        this.userID = selectedDataAdmin.userID;

        this.firstName = selectedDataAdmin.firstName;
        this.lastName = selectedDataAdmin.lastName;

        this.checkingDate = new Date(selectedDataAdmin.checkingDate);

        this.startTime = selectedDataAdmin.startTime;
        this.endTime = selectedDataAdmin.endTime;

        this.selectedLeaveHalfStatus = selectedDataAdmin.selectedLeaveHalfStatus;
        this.leaveStatuses = selectedDataAdmin.leaveStatus;
        this.additionalDescription = selectedDataAdmin.additionalDescription;
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
                        console.log("Not Admin:", data);
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
            ...this.notiAgenda
        ];
    }

    updateDropdownOptionss() {
        this.updateDropdownOptions = [
            { label: 'เลือกทั้งหมด', value: null },
            ...(Array.isArray(this.workStatus) ? this.workStatus : []),
            ...(Array.isArray(this.leaveRequestStatus) ? this.leaveRequestStatus : [])
        ];
    }

    filterDropDown(selectedStatus: string | null) {
        if (selectedStatus === null || selectedStatus === 'เลือกทั้งหมด') {
            this.filteredAgendas = [...this.agendas, ...this.notiAgenda];
        } else {
            this.filteredAgendas = this.agendas.filter(agenda => agenda.checkingStatus === selectedStatus);
            this.filteredAgendas = [
                ...this.filteredAgendas,
                ...(this.notiAgenda.filter(noti => noti.leaveStatus === selectedStatus))
            ];
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
                    if (col.field === 'checkIn' || col.field === 'startTime') {
                        row['เวลาเข้างาน'] = (item.checkIn || '') + '' + (item.startTime || '');
                    } else if (col.field === 'checkOut' || col.field === 'endTime') {
                        row['เวลาออกงาน'] = (item.checkOut || '') + '' + (item.endTime || '');
                    } else if (col.field === 'checkingStatus' || col.field === 'leaveStatus') {
                        row['สถานะ'] = (item.checkingStatus || '') + '' + (item.leaveStatus || '');
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

}
