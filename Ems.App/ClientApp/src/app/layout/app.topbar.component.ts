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

    notifications: string[] = [];

    notificationleave: string[] = [];

    user: UserModel = new UserModel();

    profileItems: any[] = [];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    @ViewChild('profileMenu') profileMenu!: Menu;

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
        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
            this.notifications = JSON.parse(storedNotifications);
        }
        this.notificationService.startConnection();
        this.notificationService.listenNotifications((message: string) => {
        this.notifications.push(message);
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    });
    }
    
    loadUserData() {
        this.authService.getUser().subscribe({
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
        if (!this.user) {
            return;
        }
        this.authService.updateUser(this.user).subscribe({
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
        localStorage.removeItem('notificationcourse'); // ลบข้อความแจ้งเตือนเมื่อล็อคเอ้าท์ออกจากระบบ
        localStorage.removeItem('notificationleave'); // ลบข้อความแจ้งเตือนเมื่อล็อคเอ้าท์ออกจากระบบ
        localStorage.removeItem('app.token');
        sessionStorage.removeItem('app.token');
        sessionStorage.removeItem('UserInfo');
        this.authService.signOut().subscribe(() => {
            this.router.navigate(['account/login']);
        });
    }

}
