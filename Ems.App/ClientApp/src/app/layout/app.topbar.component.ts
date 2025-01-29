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
        private notificationService: NotificationCourseService
    ) { }

    toggleMenu(event: Event) {
        this.profileMenu.toggle(event);
    }
    ngOnInit(): void {
        this.loadUserData();

        this.LeaveRequestService.submittedLeaveData$.subscribe((request) => {
            this.submittedLeaveData = request;
        });

        this.LeaveRequestService.getLeaveRequestNoti().subscribe(
            (notifications: LeaveRequest[]) => {
                this.leaveNotifications = notifications;
                this.createLeaveRequestMessage();
            }
        );

        // CourseNotification
        const storedNotifications = localStorage.getItem('notificationcourse');
        if (storedNotifications) {
            this.notificationcourse = JSON.parse(storedNotifications);
        }

        this.notificationService.startConnection();
        this.notificationService.listenNotifications((message: string) => {
        this.notificationcourse.push(message);

        localStorage.setItem('notificationcourse', JSON.stringify(this.notificationcourse));
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

    createLeaveRequestMessage(): void {
        if (this.leaveNotifications && this.leaveNotifications.length > 0) {
            this.leaveNotifications.forEach(notification => {
                const dateRangeStr = notification.startDate + ' ' + notification.endDate;
                // console.log('dateRangeStr:', dateRangeStr);

                const message = `
                    <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                        <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                            <i class="pi pi-user text-xl text-blue-500"></i>
                        </div>
                        <span class="text-900 line-height-3">
                            Leave Request
                            <span class="text-green-500">From ${dateRangeStr}</span>
                            <span class="text-700"> (${notification.status}) are being reviewed.
                                <span class="text-yellow-500">Currently under investigation</span>
                            </span>
                        </span>
                    </li>
                `;

                const isDuplicate = this.leaveRequestMessages.some(existingMessage => existingMessage.trim() === message.trim());

                if (!isDuplicate) {
                    this.leaveRequestMessages.push(message);
                }
            });
        }
    }

    showPositionDialog(position: string) {
        this.position = position;
        this.displayPosition = true;
    }

    logout() {
        console.log('Logging out...');
        localStorage.removeItem('notificationcourse'); //ลบข้อความแจ้งเตือนเมื่อล็อคเอ้าท์ออกจากระบบ 
        localStorage.removeItem('app.token');
        sessionStorage.removeItem('app.token');
        sessionStorage.removeItem('UserInfo');
        this.authService.signOut().subscribe(() => {
            this.router.navigate(['account/login']);
        });
    }
}
