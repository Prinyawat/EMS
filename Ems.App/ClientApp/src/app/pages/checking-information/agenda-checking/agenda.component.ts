import { CheckingService } from './../../../shared/services/checking.service';
import { AgendaService } from './../../../shared/services/agenda.service';
import { Component, ElementRef, ViewChild} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table/table';
import { customeragenda } from 'src/app/pages/checking-information/customer-checking/customers-checking';
import * as FileSaver from 'file-saver';
import { Representative } from 'src/app/demo/api/customer';
import { AgendaData } from 'src/app/shared/models/agenda.model';

@Component({
    selector: 'app-agenda',
    templateUrl: './agenda.component.html',
    providers: []
})
export class AgendaComponent {

    workStatus: any[] = [];

    breadcrumbItems: MenuItem[] = [];

    statuses: any[];

    loading: boolean = true;

    agendas: AgendaData[] = [];

    cols: any[];

    exportColumns: any[];

    representatives: Representative[] = [];

    rowGroupMetadata: any;

    @ViewChild('filter') filter!: ElementRef;

    constructor(private AgendaService: AgendaService,
        private CheckingService: CheckingService) { }

    ngOnInit() {
        this.breadcrumbItems = [];
        this.breadcrumbItems.push({ label: 'Check Information' });
        this.breadcrumbItems.push({ label: 'Checking' });
        this.breadcrumbItems.push({ label: 'User Agenda' });

        this.cols = [
            { field: 'firstName', header: 'firstName',},
            { field: 'lastName', header: 'lastName' },
            { field: 'checkingDate', header: 'checkingDate' },
            { field: 'checkIn', header: 'checkIn' },
            { field: 'checkOut', header: 'checkOut' },
            { field: 'checkingStatus', header: 'checkingStatus' },
        ];

        this.statuses = [
            {label: 'WorkFromHome', value: 'workfromhome'},
            {label: 'WorkIn', value: 'workin'}
        ]

        this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
        this.fetchAgenda();
        this.workStatus = this.CheckingService.getWorkStatus();

    }

    fetchAgenda() {
        this.CheckingService.getAgendas().subscribe({
            next: (data: AgendaData[]) => {
                this.agendas = data;
            }
        });
    }

    getStatusColor(status: string | null): string {
        if (!status) {
            return 'transparent'; // หรือกำหนดสีเริ่มต้นสำหรับสถานะที่ไม่มีค่า
        }
        switch (status.toLowerCase()) {
            case 'approved':
                return 'green';
            case 'pending':
                return 'orange';
            case 'rejected':
                return 'red';
            case 'workin':
                return 'green';
            case 'workfromhome':
                return 'blue';
            default:
                return 'gray';
        }
    }


    exportExcel() {
        import("xlsx").then(xlsx => {
            // เตรียมหัวตารางจาก this.cols
            const headers = this.cols.map(col => col.header);
            // เตรียมข้อมูลที่สัมพันธ์กับฟิลด์ใน this.cols
            const dataToExport = this.agendas.map(item => {
                const row: any = {};
                this.cols.forEach(col => {
                    row[col.header] = item[col.field];
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
