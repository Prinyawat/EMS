import { CheckingService } from './../../../shared/services/checking.service';
import { Component, Type } from '@angular/core';
import * as L from 'leaflet';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
@Component({
    selector: 'app-checking',
    templateUrl: './checking.component.html',
    providers: [ConfirmationService, MessageService]
})
export class CheckingComponent {

    selectedItem: string;

    workStatus: any[];

    checkInTime: string = '';

    checkOutTime: string = '';

    private isCheckIn: boolean = true;

    dataFromBackend: any;

    currentDateTime: string = '';

    hours: string = '00';

    minutes: string = '00';

    seconds: string = '00';

    private interval: any;

    breadcrumbItems: MenuItem[] = [];

    menuItems: MenuItem[] = [];

    valRadio: string = 'CheckIn';

    display: boolean = false;

    private map!: L.Map;

    private marker: L.Marker | null = null;

    private circle: L.Circle | null = null;
    constructor(private confirmationService: ConfirmationService,
        private messageService: MessageService, private CheckingService: CheckingService) { }

    ngOnInit(): void {
        this.breadcrumbItems = [];
        this.breadcrumbItems.push({ label: 'Check Information' });
        this.breadcrumbItems.push({ label: 'Checking' });
        this.breadcrumbItems.push({ label: 'Check Form' });

        this.initializeMap();
        this.displaySpecificLocation();
        this.startClock();

        this.workStatus = [
            { label: 'WorkIn', value: 'workin' },
            { label: 'WorkFromHome', value: 'workfromhome' },
        ];
    }

    getStatusColor(status: string): string {
        const statuses = status.toLowerCase();
        switch (statuses) {
            case 'workin':
                return 'green';
            case 'workfromhome':
                return 'blue';
            default:
                return 'gray';
        }
    }

    ngOnDestroy(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
    //
    startClock(): void {
        const now = new Date();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const day = dayNames[now.getDay()]; // Day
        const date = now.getDate(); // Date
        const month = monthNames[now.getMonth()]; // Month
        const year = now.getFullYear();

        this.interval = setInterval(() => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            this.currentDateTime = `${day} ${date} ${month} ${year}`;
            this.hours = hours;
            this.minutes = minutes;
            this.seconds = seconds;
        }, 1000);
    }

    initializeMap() {

        this.map = L.map('map').setView([18.7953, 98.9989], 13); // พิกัดของเชียงใหม่

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    async displaySpecificLocation() {
        const latitude = 18.740493;
        const longitude = 98.940390;

        if (this.marker) this.map.removeLayer(this.marker);
        if (this.circle) this.map.removeLayer(this.circle);

        this.marker = L.circleMarker([latitude, longitude], {
            color: 'blue',
            fillColor: '#0000ff',
            fillOpacity: 0.8,
            radius: 10
        }).addTo(this.map);
        this.marker.bindPopup(`<b>ตำแหน่งที่กำหนด</b><br>
                               <b>Latitude:</b> ${latitude}<br>
                               <b>Longitude:</b> ${longitude}`).openPopup();

        this.circle = L.circle([latitude, longitude], {
            color: 'blue',
            fillColor: '#add8e6',
            fillOpacity: 0.5,
            radius: 100
        }).addTo(this.map);

        this.map.setView([latitude, longitude], 20);

    }

    confirm2(event: Event) {

        const action = this.isCheckIn ? 'Check-In' : 'Check-Out';
        const successMessage = this.isCheckIn ? 'เช็คอินสำเร็จ' : 'เช็คเอาท์สำเร็จ';

        if (!this.selectedItem) {
            this.messageService.add({
                severity: 'warn',
                summary: 'เกิดข้อผิดพลาด',
                detail: 'กรุณาเลือกสถานะการเข้างาน',
            });
            return;
        }

        this.confirmationService.confirm({
            key: 'confirm2',
            target: event.target || new EventTarget(),
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const now = new Date();
                const timestamp = now.toLocaleTimeString('en-GB', { hour12: false });

                this.CheckingService.saveChecking({ timestamp: now, status: this.selectedItem}).subscribe({
                    next: () => {
                        if (this.isCheckIn) {
                            this.checkInTime = timestamp;
                        } else {
                            this.checkOutTime = timestamp;
                        }

                        this.messageService.add({
                            severity: 'success',
                            summary: 'สำเร็จ',
                            detail: successMessage,
                        });

                        this.isCheckIn = !this.isCheckIn;
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'เกิดข้อผิดพลาด',
                            detail: 'ไม่สามารถส่งข้อมูลได้',
                        });
                    },
                });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'ยกเลิก',
                    detail: 'คุณยกเลิกการส่งข้อมูล',
                });
            },
        });

        this.CheckingService.submittedData$.subscribe((data) => {
            if (data) {
                const changeTime = data?.timestamp
                    ? new Date(data.timestamp).toLocaleTimeString('en-GB', { hour12: false }) : 'Invalid timestamp';
                this.dataFromBackend = data;
            }
        });

    }
}
