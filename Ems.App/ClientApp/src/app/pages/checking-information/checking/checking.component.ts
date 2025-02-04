import { NotificationCourseService } from './../../../shared/services/notification-course.service';
import { NotificationService } from './../../../shared/services/notification.service';
import { CheckingService } from './../../../shared/services/checking.service';
import { ChangeDetectorRef, Component, Type } from '@angular/core';
import * as L from 'leaflet';
import { ConfirmationService, MenuItem, Message, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { AgendaComponent } from '../agenda-checking/agenda.component';
import { CheckingStatus, CheckingTimeData } from 'src/app/shared/models/CheckingModel';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-checking',
    templateUrl: './checking.component.html',
    providers: [ConfirmationService, MessageService, AgendaComponent]
})
export class CheckingComponent {

    checkInTimes: Date | null = null;

    checkOutTimes: Date | null = null;

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

    private destroy$ = new Subject<void>();
    constructor(private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private CheckingService: CheckingService,
        ) { }

    ngOnInit(): void {

        this.loadCheckTimeData();

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
                  statuses: item.statuses || ''
                }));
                this.selectedItem = this.workStatus.find(item => item.statuses === 'ปฏิบัติงานที่สำนักงาน') || this.workStatus[0] || null;
              }
            },
        });
    }

    loadCheckTimeData(): void {
        this.CheckingService.getInvalidCheckTime().subscribe({
            next: (data: CheckingTimeData[]) => {
                this.checkingData = data;

                if (this.checkingData.length > 0) {
                    this.isCheckIn = !this.checkingData[0].checkin;
                    this.isCheckedOut = !!this.checkingData[0].checkout;
                    this.selectedItem = this.workStatus.find(
                        (option) => option.statuses === data[0].statuses
                    ) || null;
                    this.disableButtons = this.isCheckedOut;
                }
            },
        });
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
        this.destroy$.next();
        this.destroy$.complete();
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
            ? { checkIn: now, checkOut: null, status: this.selectedItem.statuses }
            : { checkIn: null, checkOut: now, status: this.selectedItem.statuses };

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

                this.loadCheckTimeData();

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
