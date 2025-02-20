import { NotificationCourseService } from './../../../shared/services/notification-course.service';
import { NotificationService } from './../../../shared/services/notification.service';
import { CheckingService } from './../../../shared/services/checking.service';
import { ChangeDetectorRef, Component, Type } from '@angular/core';
import * as L from 'leaflet';
import { ConfirmationService, MenuItem, Message, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';

import { CheckingStatus, CheckingTimeData } from 'src/app/shared/models/CheckingModel';
import { Subject } from 'rxjs';
import { AgendaLeaveComponent } from '../agenda-leave/agenda-leave.component';

@Component({
    selector: 'app-checking',
    templateUrl: './checking.component.html',
    providers: [ConfirmationService, MessageService, AgendaLeaveComponent]
})
export class CheckingComponent {

    userPosition: { lat: number, lng: number } | null = null;

    private userMarker: any;

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
        private cdRef: ChangeDetectorRef
        ) { }

    ngOnInit(): void {
        this.showUserLocation();
        this.loadCheckTimeData();

        this.breadcrumbItems = [];
        this.breadcrumbItems.push({ label: 'ระบบบริหารจัดการการทำงาน' });
        this.breadcrumbItems.push({ label: 'เช็คอิน-เช็คเอาท์' });

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

    initializeMap() {
        this.map = L.map('map').setView([18.7953, 98.9989], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.showUserLocation();
        this.addUserLocationButton();


        this.addMockLocationButton();
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
        this.marker.bindPopup(`<b>ที่ทำงาน</b><br>
                               <b>ละติจูด:</b> ${latitude}<br>
                               <b>ลองจิจูด:</b> ${longitude}`).openPopup();

        this.circle = L.circle([latitude, longitude], {
            color: 'blue',
            fillColor: '#add8e6',
            fillOpacity: 0.5,
            radius: 100
        }).addTo(this.map);

        this.map.setView([latitude, longitude], 20);
    }

    checkIfInArea(userLat: number, userLng: number): boolean {
        const workLat = 18.740493;
        const workLng = 98.940390;
        const radius = 100;

        const workLocation = L.latLng(workLat, workLng);
        const userLocation = L.latLng(userLat, userLng);

        const distance = workLocation.distanceTo(userLocation);

        return distance <= radius;
    }

    showUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    const workLat = 18.740493;
                    const workLng = 98.940390;
                    const accuracy = position.coords.accuracy;

                    const userIcon = L.icon({
                        iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                        iconSize: [32, 32]
                    });

                    this.reverseGeocode(userLat, userLng).then(address => {
                        if (this.userMarker) {
                            this.userMarker.setLatLng([userLat, userLng]);
                        } else {
                            this.userMarker = L.marker([userLat, userLng], { icon: userIcon })
                                .addTo(this.map)
                                .bindPopup(`<b>ตำแหน่งของคุณ</b><br>${address}<br>ละติจูด: ${userLat}, ลองจิจูด: ${userLng}`)
                                .openPopup();
                        }
                    }).catch(error => {
                        if (this.userMarker) {
                            this.userMarker.setLatLng([userLat, userLng]);
                        } else {
                            this.userMarker = L.marker([userLat, userLng], { icon: userIcon })
                                .addTo(this.map)
                                .bindPopup(`<b>ตำแหน่งของคุณ</b><br>Lat: ${userLat}, Lng: ${userLng}`)
                                .openPopup();
                        }
                    });

                    if (!this.marker) {
                        this.marker = L.marker([workLat, workLng])
                            .addTo(this.map)
                            .bindPopup(`<b>ที่ทำงาน</b><br>Lat: ${workLat}, Lng: ${workLng}`)
                            .openPopup();
                    }

                    const bounds = L.latLngBounds([
                        [userLat, userLng],
                        [workLat, workLng]
                    ]);
                    this.map.fitBounds(bounds, { padding: [50, 50] });

                    const isInArea = this.checkIfInArea(userLat, userLng);

                    if (isInArea) {
                        console.log("User is inside the area. Enable actions.");
                        this.disableButtons = false;
                        console.log(this.disableButtons);
                        this.cdRef.detectChanges();
                    } else {
                        console.log("User is outside the area. Disable actions.");
                        this.disableButtons = true;
                        console.log(this.disableButtons);
                        this.cdRef.detectChanges();
                    }

                    this.userPosition = { lat: userLat, lng: userLng };
                },
                (error) => console.error("Error getting location:", error),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    reverseGeocode(lat: number, lng: number): Promise<string> {
        const apiKey = '834b7140eee24d1799ac9bced5bb066b';
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&language=th&pretty=1`;

        return fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const address = data.results[0].formatted;
                    return address;
                } else {
                    throw new Error("ไม่พบที่อยู่");
                }
            })
            .catch(error => {
                console.error("Error in geocoding:", error);
                throw error;
            });
    }

    addUserLocationButton() {
        const button = L.control({ position: 'topright' });

        button.onAdd = () => {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            div.innerHTML = '<button style="background:white; border: none; padding: 5px; cursor: pointer;">📍ตำแหน่งของฉัน</button>';

            div.onclick = () => {
                if (this.userPosition) {
                    this.map.setView([this.userPosition.lat, this.userPosition.lng], 15);
                } else {
                    alert("ยังไม่ได้ระบุตำแหน่งของคุณ!");
                }
            };
            return div;
        };
        button.addTo(this.map);
    }

    //mock up
    mockLocation(isInside: boolean): void {
        let userLat: number;
        let userLng: number;

        // ถ้าผู้ใช้ "inside" (ในพื้นที่)
        if (isInside) {
            userLat = 18.740493;  // ตัวอย่างพิกัดของที่ทำงาน
            userLng = 98.940390;
        }
        // ถ้าผู้ใช้ "outside" (นอกพื้นที่)
        else {
            userLat = 19.740493;  // พิกัดที่อยู่นอกพื้นที่
            userLng = 99.940390;
        }

        // เรียกใช้ฟังก์ชัน showUserLocation() กับพิกัดที่ mock ขึ้นมา
        this.showUserLocationWithMockedCoords(userLat, userLng);
    }

    showUserLocationWithMockedCoords(userLat: number, userLng: number): void {
        const workLat = 18.740493;
        const workLng = 98.940390;
        const accuracy = 50;  // ระยะความแม่นยำของพิกัด

        const userIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            iconSize: [32, 32]
        });

        // จำลองการ reverse geocoding
        this.reverseGeocode(userLat, userLng).then(address => {
            if (this.userMarker) {
                this.userMarker.setLatLng([userLat, userLng]);
            } else {
                this.userMarker = L.marker([userLat, userLng], { icon: userIcon })
                    .addTo(this.map)
                    .bindPopup(`<b>ตำแหน่งของคุณ</b><br>${address}<br>Lat: ${userLat}, Lng: ${userLng}`)
                    .openPopup();
            }
        }).catch(error => {
            if (this.userMarker) {
                this.userMarker.setLatLng([userLat, userLng]);
            } else {
                this.userMarker = L.marker([userLat, userLng], { icon: userIcon })
                    .addTo(this.map)
                    .bindPopup(`<b>ตำแหน่งของคุณ</b><br>Lat: ${userLat}, Lng: ${userLat}, Lng: ${userLng}`)
                    .openPopup();
            }
        });

        // กำหนดพิกัดของ "ที่ทำงาน" และทำการคำนวณว่าอยู่ในพื้นที่หรือไม่
        const bounds = L.latLngBounds([
            [userLat, userLng],
            [workLat, workLng]
        ]);
        this.map.fitBounds(bounds, { padding: [50, 50] });

        const isInArea = this.checkIfInArea(userLat, userLng);

        if (isInArea) {
            console.log("User is inside the area. Enable actions.");
            this.disableButtons = false;
        } else {
            console.log("User is outside the area. Disable actions.");
            this.disableButtons = true;
        }

        this.userPosition = { lat: userLat, lng: userLng };
    }


    addMockLocationButton() {
        const buttonInside = L.control({ position: 'topright' });
        buttonInside.onAdd = () => {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            div.innerHTML = '<button style="background:white; border: none; padding: 5px; cursor: pointer;">Inside Area</button>';
            div.onclick = () => this.mockLocation(true); // ทดสอบ "inside"
            return div;
        };
        buttonInside.addTo(this.map);

        const buttonOutside = L.control({ position: 'topright' });
        buttonOutside.onAdd = () => {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            div.innerHTML = '<button style="background:white; border: none; padding: 5px; cursor: pointer;">Outside Area</button>';
            div.onclick = () => this.mockLocation(false); // ทดสอบ "outside"
            return div;
        };
        buttonOutside.addTo(this.map);
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

            // ปรับเวลาให้ตรงกับเขตเวลาไทย (UTC+7)
            const thaiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));

            // ใช้ toLocaleDateString เพื่อแสดงวันที่ในภาษาไทย
            const dayOfWeek = thaiTime.toLocaleString('th-TH', { weekday: 'long' });
            const day = String(thaiTime.getDate()).padStart(2, '0');
            const month = thaiTime.toLocaleString('th-TH', { month: 'long' });
            const year = String(thaiTime.getFullYear());

            // ใช้ toLocaleString เพื่อแสดงเวลาในภาษาไทย
            const formattedTime = thaiTime.toLocaleString('th-TH', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });

            // แยกเวลาออกเป็น ชั่วโมง นาที วินาที และ am/pm
            let [time, ampm] = formattedTime.split(' ');
            if (ampm === 'AM') {
                ampm = 'น.';
            } else if (ampm === 'PM') {
                ampm = 'น.';
            }

            const [formattedHours, formattedMinutes, formattedSeconds] = time.split(':');
            this.time = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
            this.day = `${dayOfWeek}ที่ ${day}`;
            this.month = month;
            this.year = year;
        }, 1000);
    }


    confirm2(event: Event): void {
        const action = this.isCheckIn ? 'Check-In' : 'Check-Out';
        const successMessage = this.isCheckIn ? 'เช็คอินสำเร็จ' : 'เช็คเอาท์สำเร็จ';

        const now = new Date();
        const thaiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
        const saveData = this.isCheckIn
            ? { checkIn: thaiTime, checkOut: null, status: this.selectedItem.statuses }
            : { checkIn: null, checkOut: thaiTime, status: this.selectedItem.statuses };

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
