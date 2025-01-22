import { LeaveRequestService } from './../../../shared/services/leaveequest.service';
import { NotificationService } from '../../../shared/services/notification.service';

import { Component, ViewChild} from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { debounceTime, Subscription } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
@Component({
    selector: 'app-leave-request',
    templateUrl: './leave-request.component.html',
    providers: [MessageService, ConfirmationService, ProductService, LayoutService]
})
export class LeaveRequestComponent {

    dateRange: string[] = [];

    selectedItem: string;

    leaveRequestStatus: any[];

    today: Date;

    breadcrumbItems: MenuItem[] = [];

    menuItems: MenuItem[] = [];

    uploadedFiles: any[] = [];

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
        private LeaveRequestService: LeaveRequestService) {
            this.subscription = this.layoutService.configUpdate$
                .pipe(debounceTime(25))
                .subscribe((config) => {
                    this.initChart();
                    });
            }
    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

    formatRangeDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear() + 543;
        return `${day}/${month}/${year}`;
      }

    generateDateRange(): string[] {
        if (!Array.isArray(this.selectedDate) || this.selectedDate.length !== 2) {
          return [];
        }
        const startDate = this.selectedDate[0];
        const endDate = this.selectedDate[1];

        const dateList: string[] = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          dateList.push(this.formatDate(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateList;
    }


    onGenerateDateRange() {
        this.dateRange = this.generateDateRange();
    }


    confirm2(event: Event) {
        if (!Array.isArray(this.selectedDate) || this.selectedDate.length !== 2 ||
        !(this.selectedDate[0] instanceof Date) || !(this.selectedDate[1] instanceof Date) ||
        !this.selectedItem) {
            this.messageService.add({
                severity: 'warn',
                summary: 'กรุณาเลือกวันที่และสถานะ',
                detail: 'โปรดเลือกทั้งช่วงวันที่และสถานะการลาหยุด'
            });
            return;
        }
        this.confirmationService.confirm({
            key: 'confirm2',
            target: event.target || new EventTarget(),
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const startDate = this.selectedDate[0];
                const endDate = this.selectedDate[1];

                const startDateString = this.formatDate(startDate);
                const endDateString = this.formatDate(endDate);

                this.LeaveRequestService.saveleaveRequest({
                    startDate: startDateString,
                    endDate: endDateString,
                    status: this.selectedItem }).subscribe({
                    next: (response) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'ส่งคำขอสำเร็จแล้ว.',
                        });
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'เกิดข้อผิดพลาดในการส่งคำขอ',
                        });
                    },
                });
            },
            reject: () => {
            }
        });
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
        const utcDate = new Date(date).toISOString(); // แปลงวันที่เป็น UTC
        const year = utcDate.substring(0, 4); // ปี
        const month = utcDate.substring(5, 7); // เดือน
        const day = utcDate.substring(8, 10); // วัน
        return `${year}-${month}-${day}`; // แสดงแค่วัน เดือน ปี
    }

    ngOnInit() {
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

        this.leaveRequestStatus = [
            { label: 'SickLeave', value: 'sickleave' },
            { label: 'StudyLeave', value: 'studyleave' },
            { label: 'AnnualLeave', value: 'annualleave' },
            { label: 'PersonalLeave', value: 'personalleave' },
            { label: 'MaternityLeave', value: 'maternityleave'},
        ];
    }

    getStatusColor(status: string): string {
        const leavestatus = status.toLowerCase();
        switch (leavestatus) {
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
}
