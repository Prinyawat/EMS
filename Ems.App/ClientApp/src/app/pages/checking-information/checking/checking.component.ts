import { ValidCheckingService } from './../../../shared/services/validchecking.service';
import { NotificationCourseService } from './../../../shared/services/notification-course.service';
import { NotificationService } from './../../../shared/services/notification.service';
import { CheckingService } from './../../../shared/services/checking.service';
import { Component, Type } from '@angular/core';
import * as L from 'leaflet';
import { ConfirmationService, MenuItem, Message, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { AgendaComponent } from '../agenda-checking/agenda.component';
import { CheckingStatus, CheckingTimeData } from 'src/app/shared/models/CheckingModel';

@Component({
    selector: 'app-checking',
    templateUrl: './checking.component.html',
    providers: [ConfirmationService, MessageService, AgendaComponent]
})
export class CheckingComponent {

    checkingData: CheckingTimeData[] = [];

    lastTimeDate: any;

    disableButtons: boolean = false;

    isCheckedOut: boolean = false;

    isButtonDisabled: boolean = false;

    checkInTimeLabel: Date | null = null;

    checkOutTimeLabel: Date | null = null;

    isCheckIn: boolean = true;

    clickCount: number = 0;

    agendas: any[] = [];

    selectedItem: CheckingStatus | null = null;

    workStatus: CheckingStatus[] = [];

    checkInTime: string = '';

    checkOutTime: string = '';

    dataFromBackend: any;

    year: string = '';

    month: string = '';

    day: string = '';

    time: string = '';

    private interval: any;

    breadcrumbItems: MenuItem[] = [];

    menuItems: MenuItem[] = [];

    private map!: L.Map;

    private marker: L.Marker | null = null;

    private circle: L.Circle | null = null;
    constructor(private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private CheckingService: CheckingService,
        private ValidCheckingService: ValidCheckingService ) { }

    ngOnInit(): void {
        this.loadCheckTimeData();

        this.ValidCheckingService.startConnection();
        this.ValidCheckingService.listenNotifications((message: string) => {
            this.handleNotification(message);
        });

        // this.CheckingService.getInvalidCheckTime().subscribe({
        //     next: (data: CheckingTimeData[]) => {
        //       console.log(data);
        //       this.checkingData = data;
        //     },
        // });

        this.breadcrumbItems = [];
        this.breadcrumbItems.push({ label: 'Check Information' });
        this.breadcrumbItems.push({ label: 'Checking' });
        this.breadcrumbItems.push({ label: 'Check Form' });

        this.initializeMap();
        this.displaySpecificLocation();
        this.startClock();

        this.CheckingService.getCheckinStatus().subscribe({
            next: (data) => {
              if (Array.isArray(data)) {
                this.workStatus = data.map(item => ({
                  status: item.status || ''
                }));
                this.selectedItem = this.workStatus.find(status => status.status === 'ปฏิบัติงานที่สำนักงาน') || this.workStatus[0] || null;
              }
            },
        });
    }

    loadCheckTimeData(): void {
        this.CheckingService.getInvalidCheckTime().subscribe({
            next: (data: CheckingTimeData[]) => {
                console.log('อัปเดตข้อมูล:', data);
                this.checkingData = data;

                if (data.length > 0) {
                    this.checkInTime = data[0].checkin
                        ? new Date(data[0].checkin).toLocaleString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })
                        : null;

                    this.checkOutTime = data[0].checkout
                        ? new Date(data[0].checkout).toLocaleString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })
                        : null;


                    this.isCheckIn = !!this.checkInTime && !this.checkOutTime;
                    this.isCheckedOut = !!this.checkOutTime;

                    console.log('isCheckIn:', this.isCheckIn);
                    console.log('isCheckedOut:', this.isCheckedOut);
                }
            },
        });
    }

    private handleNotification(message: string): void {
        if (message === 'LogOutNull') {
            console.log('วันนี้เอ็งเหลือเช็คเอ๊าท์นะเห้ย !');
            this.isCheckIn = false;
        } else if (message === 'LogOutHasValue') {
            console.log('วันนี้เอ็งเช็คอินครบแล้ว.');
            this.disableButtons = true;
            this.isCheckIn = true;
        } else if (message === 'NoLoginSystem') {
            console.log('แม่งลืมเช็คตั้งแต่ไหนนิ');
            this.isCheckIn = true;
        } else {
            console.log('เอ็งทำระบบพัง กลับไปดู Bug!', message);
        }
    }

    getStatusColor(status: string): string {
        const statuses = status.toLowerCase();
        switch (statuses) {
            case 'ปฏิบัติงานที่สำนักงาน':
                return 'green';
            case 'ปฏิบัติงานจากที่บ้าน':
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

    startClock(): void {
        const daysOfWeek = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
        const months = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];

        this.interval = setInterval(() => {
            const now = new Date();

            const day = String(now.getDate()).padStart(2, '0');
            const dayOfWeek = daysOfWeek[now.getDay()];
            const month = months[now.getMonth()];
            const year = String(now.getFullYear());

            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            let ampm = 'AM';

            if (hours >= 12) {
                ampm = 'PM';
                    if (hours > 12) hours -= 12;
                        } else if (hours === 0) {
                            hours = 12;
            }


        const formattedHours = String(hours).padStart(2, '0');
            this.time = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
            this.day = `วัน${dayOfWeek}ที่ ${day}`;
            this.month = month;
            this.year = year;
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

    confirm2(event: Event): void {
        const action = this.isCheckIn ? 'Check-In' : 'Check-Out';
        const successMessage = this.isCheckIn ? 'เช็คอินสำเร็จ' : 'เช็คเอาท์สำเร็จ';

        const now = new Date();
        const saveData = this.isCheckIn
            ? { checkIn: now, checkOut: null, status: this.selectedItem.status }
            : { checkIn: null, checkOut: now, status: this.selectedItem.status };

        this.CheckingService.saveChecking({
            checkin: saveData.checkIn,
            checkout: saveData.checkOut,
            statuses: saveData.status
        }).subscribe({
            next: () => {
                if (saveData.checkIn) {
                    this.checkInTime = saveData.checkIn;
                    this.isCheckIn = false;
                }
                if (saveData.checkOut) {
                    this.checkOutTime = saveData.checkOut;
                    this.isCheckedOut = true;
                    this.disableButtons = true;
                }

                this.messageService.add({
                    severity: 'success',
                    summary: 'สำเร็จ',
                    detail: successMessage,
                });
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'เกิดข้อผิดพลาด',
                    detail: 'ไม่สามารถบันทึกข้อมูลได้',
                });
            },
        });
    }

}
