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

        this.initializeMap();
        this.getCurrentLocation();
      }

      initializeMap() {

        this.map = L.map('map').setView([18.7953, 98.9989], 13); // พิกัดของเชียงใหม่

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
      }

      async getCurrentLocation() {
        try {
            // ตรวจสอบสิทธิ์การเข้าถึง GPS
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

            if (permissionStatus.state === 'granted') {
                // สิทธิ์ได้รับอนุญาตแล้ว
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                    this.addMarker(latitude, longitude);  // สร้าง marker ที่ตำแหน่งที่ได้รับ
                }, (error) => {
                    console.error('Error getting location:', error);
                });

            } else if (permissionStatus.state === 'prompt') {
                // สิทธิ์ยังไม่ได้รับอนุญาต แสดงให้ผู้ใช้อนุญาต
                alert('กรุณาอนุญาตให้ใช้ตำแหน่งของคุณ');
                // เมื่อต้องการให้ขออนุญาต GPS ต้องเรียก getCurrentPosition เพื่อแสดงกล่องขออนุญาต
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    this.addMarker(latitude, longitude);
                });
            } else {
                // สิทธิ์ถูกบล็อกหรือไม่อนุญาต
                alert('ไม่อนุญาตให้ใช้ตำแหน่งของคุณ');
            }
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์: ' + error.message);
        }
    }

    addMarker(latitude: number, longitude: number) {
        // สร้าง Marker และเพิ่มลงในแผนที่
        const marker = L.marker([latitude, longitude]).addTo(this.map);
        marker.bindPopup("<b>คุณอยู่ที่นี่</b>").openPopup();
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
