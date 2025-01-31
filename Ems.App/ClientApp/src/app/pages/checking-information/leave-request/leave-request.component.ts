import { Time } from '@angular/common';
import { LeaveRequestService } from '../../../shared/services/leaverequest.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { debounceTime, Subscription } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { LeaveHalfStatus, LeaveStatusData } from 'src/app/shared/models/leaverequest.model';
import { FileUpload } from 'primeng/fileupload';

@Component({
    selector: 'app-leave-request',
    templateUrl: './leave-request.component.html',
    providers: [MessageService, ConfirmationService, ProductService, LayoutService]
})
export class LeaveRequestComponent {

    additionalDescription: string = '';

    Dates: Date[] = [];

    startTime: string = '';

    endTime: string = '';

    HalfStatusOn: boolean = false;

    isCustomLeave: boolean = false;

    @ViewChild('fileUploader') fileUploader!: FileUpload;

    InvselectedDates: boolean = false;

    InvselectedLeaveHalfStatus: boolean = false;

    InvselectedLeaveStatus: boolean = false;

    InvstartTime: boolean = false;

    InvendTime: boolean = false;

    // -------------------------------------------------
    StartTime: Time;

    dates: Date[] | undefined;

    selectedCategory: any = null;

    dateRange: string[] = [];

    selectedHalf: string;

    leaveHalfStatus: any[];

    selectedItem: string;

    selectedLeaveHalfStatus: LeaveHalfStatus | null = null;

    leaveRequestHalfStatus: LeaveHalfStatus[] = [];

    selectedLeaveStatus: LeaveStatusData | null = null;

    leaveRequestStatus: LeaveStatusData[] = [];

    today: Date;

    breadcrumbItems: MenuItem[] = [];

    menuItems: MenuItem[] = [];

    uploadedFiles: File[] = [];

    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    selectedDate: Date | null = null;

    constructor(private productService: ProductService,
        public layoutService: LayoutService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private NotificationService: NotificationService,
        private LeaveRequestService: LeaveRequestService,
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    ngOnInit() {

        this.LeaveRequestService.getLeaveRequestStatus().subscribe({
            next: (data) => {
                if (Array.isArray(data)) {
                    this.leaveRequestStatus = data
                }
            },
        });

        this.LeaveRequestService.getLeaveRequestHalfStatus().subscribe({
            next: (data) => {
                if (Array.isArray(data)) {
                    this.leaveRequestHalfStatus = data
                    }
                }
            },
        );

        this.breadcrumbItems = [];
        this.breadcrumbItems.push({ label: 'Check Information' });
        this.breadcrumbItems.push({ label: 'Checking' });
        this.breadcrumbItems.push({ label: 'Leave Request' });

        this.initChart();
        this.productService.getProductsSmall().then(data => this.products = data);

        this.today = new Date();

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }

    onSelect(event: any) {
        this.uploadedFiles = [...event.files]; // ต้องใช้ spread `[...]` เพื่อให้เก็บค่าแบบ Array
        console.log("ไฟล์ที่เลือก:", this.uploadedFiles);
    }

      // กด Confirm แล้วส่ง API
    confirmLeaveRequest() {
        if (this.uploadedFiles.length === 0) {
          console.warn('⚠ No files selected!');
          return;
        }


    }

    onBasicUpload() {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
    }

    formatRangeDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear() + 543;
        return `${day}/${month}/${year}`;
    }

    showWarnViaToast(): void {
        this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'กรุณาเลือกวันที่ต้องการจะส่งคำขอ'
        });
    }

    showWarnStatusToast(): void {
        this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'กรุณาเลือกประเภทคำลา'
        });
    }

    //function แปลงค่าของวันที่
    formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear() + 543;
        return `${day}/${month}/${year}`;
    }

    getStatusColor(status: string): string {
        const leavestatus = status.toLowerCase();
        switch (leavestatus) {
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
            case 'ลาครึ่งเช้า':
                return 'orange';
            case 'ลาครึ่งบ่าย':
                return '#FFD700';
            case 'ลาทั้งวัน':
                return 'red';
            case 'ปรับแต่งการลาเอง':
                return 'black';
            default:
                return 'black';
        }
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onCalendarSelect(event: any) {
        this.selectedDate = event;
        if (!this.Dates.some(date => date.toDateString() === event.toDateString())) {
            this.Dates.push(event);
        }
        this.selectedLeaveHalfStatus = null;
    }

    onCalendarBlur() {
        if (!this.selectedDate) {
            this.startTime = '';
            this.endTime = '';
        }
    }

    ngCalendarCheck() {
        if (this.Dates.length === 0) {
            this.startTime = '';
            this.endTime = '';
        }
    }

    onModelChange(event: any) {
        if (!this.Dates || this.Dates.length === 0) {
            this.startTime = '';
            this.endTime = '';
        }
    }

    onClearCalendarDate() {
        this.Dates = [];
        this.startTime = '';
        this.endTime = '';
        this.HalfStatusOn = false;

    }

    onLeaveStatusChange() {
        if (this.selectedLeaveHalfStatus) {
            switch (this.selectedLeaveHalfStatus.halfStatus) {
                case 'ลาครึ่งเช้า':
                    this.HalfStatusOn = false;
                    this.isCustomLeave = true;
                    break;

                case 'ลาครึ่งบ่าย':
                    this.HalfStatusOn = false;
                    this.isCustomLeave = true;
                    break;

                case 'ลาทั้งวัน':
                    this.HalfStatusOn = false;
                    this.isCustomLeave = true;
                    break;
                case 'ปรับแต่งการลาเอง':
                    this.startTime = '';
                    this.endTime = '';
                    this.HalfStatusOn = false;
                    this.isCustomLeave = true;
                    break;

                default:
                    this.startTime = '';
                    this.endTime = '';
                    this.HalfStatusOn = false;
                    this.Dates = [];
                    break;
            }
        } else {
            this.startTime = '';
            this.endTime = '';
            this.HalfStatusOn = false;
            this.Dates = [];
        }
    }

    confirm2(event: Event): void {
        const selectedDates = this.Dates.length > 0 ? this.Dates.map(date => this.formatDate(date)).join(', ') : null;
        const selectedLeaveHalfStatus = this.selectedLeaveHalfStatus ? this.selectedLeaveHalfStatus.halfStatus : null;
        const selectedLeaveStatusId = this.selectedLeaveStatus ? this.selectedLeaveStatus.leaveStatusId : null;
        const selectedLeaveStatus = this.selectedLeaveStatus ? this.selectedLeaveStatus.leaveStatusData : null;
        const selectHalfStatusId = this.selectedLeaveHalfStatus ? this.selectedLeaveHalfStatus.leaveHalfId : null;
        const startTime = this.startTime ? new Date(this.startTime).toLocaleTimeString() : null;
        const endTime = this.endTime ? new Date(this.endTime).toLocaleTimeString() : null;
        const additionalDescription = this.additionalDescription;
        const uploadedFiles = this.uploadedFiles;

        this.InvselectedDates = !this.InvselectedDates;
        this.InvselectedLeaveHalfStatus = !this.InvselectedLeaveHalfStatus;
        this.InvselectedLeaveStatus = !this.InvselectedLeaveStatus;
        this.InvstartTime = !this.InvstartTime;
        this.InvendTime = !this.InvendTime;

        if (!this.InvselectedDates || !this.InvselectedDates || !this.InvselectedLeaveHalfStatus || !this.InvstartTime || !this.InvendTime) {
        }

        if (!selectedDates || !selectedLeaveHalfStatus || !selectedLeaveStatus || !startTime || !endTime) {
            this.messageService.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากรอกข้อมูลให้ครบ!' });
            return;
        }

        const formData = {
            selectedDates,
            selectedLeaveStatus,
            selectedLeaveStatusId,
            selectedLeaveHalfStatus,
            selectHalfStatusId,
            startTime,
            endTime,
            additionalDescription,
            uploadedFiles
        };

        this.LeaveRequestService.saveleaveRequest(formData).subscribe({
            next: (response) => {
                this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'ส่งคำขอการลาสำเร็จ!' });
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'ล้มเหลว', detail: 'เกิดข้อผิดพลาดในการส่งคำขอ!' });
            },
        });
    }
}


