import { LeaveRequestService } from './../shared/services/leaverequest.service';
import { NotificationService } from './../shared/services/notification.service';

import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';
import { Menu } from 'primeng/menu';
import { ListDemoComponent } from '../demo/components/uikit/list/listdemo.component';
import { AuthService } from '../shared/services/auth.service';
import { LeaveRequest } from '../shared/models/leaverequest.model';
import { NotificationCourseService } from '../shared/services/notification-course.service';
import { UserModel } from '../shared/models/user.modal';
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [
    ],
})
export class AppTopBarComponent {


    leaveNotifications: { startDate: string, endDate: string, status: string }[] = [];


    sendLeaveRequestDate: string;

    leaveRequestMessages: string[] = [];

    submittedLeaveData: string | null = null;

    items!: MenuItem[];

    displayPosition: boolean;

    edit: boolean = false;

    position: string;

    notificationcourse: string[] = [];

    notificationleave: string[] = [];

    user: UserModel = new UserModel();
    profileItems: any[] = [];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    @ViewChild('profileMenu') profileMenu!: Menu;

    // dropdownItems = [
    //     { name: 'Frontend Developer', code: 'Option 1' },
    //     { name: 'Backend Developer', code: 'Option 2' },
    //     { name: 'Fullstack Developer', code: 'Option 3' }
    // ];

    // profileItems = [
    //     { label: 'Firstname Lastname', icon: 'pi pi-user' },
    //     { label: 'Edit', icon: 'pi pi-fw pi-user-edit', command: () => this.edit = true },
    //     { separator: true },
    //     { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
    // ];

    constructor(public layoutService: LayoutService, private router: Router,
        private authService: AuthService,
        private LeaveRequestService: LeaveRequestService,
        private notificationService: NotificationCourseService,
        private NotificationService: NotificationService,
    ) { }

    toggleMenu(event: Event) {
        this.profileMenu.toggle(event);
    }
    ngOnInit(): void {
        // Update Proflie user SignalR
        this.loadUserData();
        this.notificationService.userUpdated$.subscribe((updatedUser: any) => {
            if (updatedUser.userId === this.user.userId) {
            this.user = updatedUser;
            this.updateProfileItems();
            }
        });

        // CourseNotification
        const leaveNotifications = localStorage.getItem('notificationleave');
if (leaveNotifications) {
    this.notificationleave = JSON.parse(leaveNotifications);
}

// เริ่มการเชื่อมต่อกับ notification service
this.notificationService.startConnection();

// ฟังการแจ้งเตือนจาก server
this.notificationService.listenNotifications((message: string) => {
    console.log(message);

    // ตรวจสอบว่ามีข้อความนี้ใน notificationleave หรือไม่
    if (!this.notificationleave.includes(message)) {
        // ถ้าไม่มี, เพิ่มข้อความใหม่
        this.notificationleave.push(message);

        // บันทึกข้อมูลการแจ้งเตือนใหม่ใน localStorage
        console.log("Saving to localStorage:", this.notificationleave);
        localStorage.setItem('notificationleave', JSON.stringify(this.notificationleave));
    } else {
        console.log("Duplicate notification, not saving:", message);
    }
});



    }

    loadUserData() {
        const userId = "42cfb3be-fa01-499a-95af-fa0a879fb0ad";
        this.authService.getUser(userId).subscribe({
          next: (data: any) => {
            this.user = data;
            this.updateProfileItems();
          },
          error: (err) => {
            console.error("Error fetching user data", err);
          }
        });
    }

    updateProfileItems() {
        this.profileItems = [
            { label: `${this.user.firstname} ${this.user.lastname}`, icon: 'pi pi-user' },
            { label: 'Edit', icon: 'pi pi-fw pi-user-edit', command: () => this.edit = true },
            { separator: true },
            { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
        ];
    }

    saveUserData() {
        if (!this.user || !this.user.userId) {
            return;
        }
        this.authService.updateUser(this.user.userId, this.user).subscribe({
            next: (response: any) => {
                console.log("User updated successfully", response);
                this.edit = false;
            },
            error: (err) => {
                console.error("Error updating user", err);
            }
        });
    }

    showPositionDialog(position: string) {
        this.position = position;
        this.displayPosition = true;
    }

    logout() {
        console.log('Logging out...');
        localStorage.removeItem('notificationcourse'); //
        localStorage.removeItem('notificationleave');
        // ลบข้อความแจ้งเตือนเมื่อล็อคเอ้าท์ออกจากระบบ
        localStorage.removeItem('app.token');
        sessionStorage.removeItem('app.token');
        sessionStorage.removeItem('UserInfo');
        this.authService.signOut().subscribe(() => {
            this.router.navigate(['account/login']);
        });
    }

}
