import { Component, ElementRef, ViewChild} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table/table';
import { customeragenda } from 'src/app/pages/checking-information/customer-checking/customers-checking';
import * as FileSaver from 'file-saver';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
    selector: 'app-agenda',
    templateUrl: './agenda.component.html',
    providers: []
})
export class AgendaComponent {

    breadcrumbItems: MenuItem[] = [];

    statuses: any[];

    loading: boolean = true;

    customeragenda = customeragenda;

    cols: any[];

    exportColumns: any[];

    @ViewChild('filter') filter!: ElementRef;

    constructor() { }

    ngOnInit() {
        this.breadcrumbItems = [];
        this.breadcrumbItems.push({ label: 'Check Information' });
        this.breadcrumbItems.push({ label: 'Checking' });
        this.breadcrumbItems.push({ label: 'User Agenda' });

        this.cols = [
            { field: 'name', header: 'Name'},
            { field: 'days', header: 'Days' },
            { field: 'checkin', header: 'Check In' },
            { field: 'checkout', header: 'Check Out' },
            { field: 'date', header: 'Date' },
            { field: 'status', header: 'Status' },
        ];

        this.statuses = [
            {label: 'None', value: 'none'},
            {label: 'LeaveRequest', value: 'leaverequest'},
            {label: 'WorkFromHome', value: 'workfromhome'},
            {label: 'WorkIn', value: 'workin'}
        ]

        this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    }

    getStatusColor(status: string): string {
        const normalizedStatus = status.toLowerCase();
        switch (normalizedStatus) {
            case 'none':
                return 'gray';
            case 'leaverequest':
                return 'red';
            case 'workfromhome':
                return 'blue';
            case 'workin':
                return 'green';
            default:
                return 'gray';
        }
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            // เตรียมหัวตารางจาก this.cols
            const headers = this.cols.map(col => col.header);
            // เตรียมข้อมูลที่สัมพันธ์กับฟิลด์ใน this.cols
            const dataToExport = this.customeragenda.map(item => {
                const row: any = {};
                this.cols.forEach(col => {
                    row[col.header] = item[col.field]; // ใช้ header เป็นคีย์
                });
                return row;
            });

            // สร้าง worksheet โดยใส่หัวตารางและข้อมูล
            const worksheet = xlsx.utils.json_to_sheet(dataToExport, { header: headers });
            // สร้าง workbook และเพิ่ม worksheet ลงไป
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            // แปลง workbook เป็นไฟล์ Excel
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            // บันทึกไฟล์ Excel
            this.saveAsExcelFile(excelBuffer, "products");
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
