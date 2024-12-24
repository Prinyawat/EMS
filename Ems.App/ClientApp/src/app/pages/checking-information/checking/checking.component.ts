import { Component} from '@angular/core';
import * as L from 'leaflet';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
@Component({
    selector: 'app-checking',
    templateUrl: './checking.component.html',
    providers: [ConfirmationService, MessageService]
})
export class CheckingComponent {

    breadcrumbItems: MenuItem[] = [];

    menuItems: MenuItem[] = [];

    valRadio: string = 'CheckIn';

    display: boolean = false;

    private map!: L.Map;
constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService){}

    ngOnInit(): void {
        this.breadcrumbItems = [];
        this.breadcrumbItems.push({ label: 'Check Information' });
        this.breadcrumbItems.push({ label: 'Checking' });
        this.breadcrumbItems.push({ label: 'Check Form' });
        // พิกัดเริ่มต้นของแผนที่
        this.map = L.map('map').setView([18.7953, 98.9989], 13); // พิกัดของเชียงใหม่ (latitude, longitude)

        // ใช้ OpenStreetMap สำหรับแผนที่
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
      }

      confirm2(event: Event) {
        this.confirmationService.confirm({
            key: 'confirm2',
            target: event.target || new EventTarget,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }
}
