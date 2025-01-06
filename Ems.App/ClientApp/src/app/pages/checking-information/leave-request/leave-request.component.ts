import { CheckingService } from './../../../shared/services/checking.service';
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
        private checkingService: CheckingService
        ) {
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

    confirm2(event: Event) {
        if (!this.selectedDate) {
            // console.log('No date selected');
            this.showWarnViaToast();
            return;
        }
        const formattedDate = this.formatDate(this.selectedDate);

        this.confirmationService.confirm({
            key: 'confirm2',
            target: event.target || new EventTarget(),
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // console.log('Selected Date:', this.selectedDate);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Data has been submitted successfully.'
                  });

                  this.checkingService.saveData(this.selectedDate)
            },
            reject: () => {
                // console.log('User rejected');
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelled',
                    detail: 'Data submission has been cancelled.'
                  });
            }
        });
    }

    showWarnViaToast(): void {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please select a date before proceeding.'
        });
      }

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

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
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
