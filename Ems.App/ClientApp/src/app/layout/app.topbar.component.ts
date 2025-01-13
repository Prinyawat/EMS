import { NotificationService } from './../shared/services/notification.service';

import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';
import { Menu } from 'primeng/menu';
import { ListDemoComponent } from '../demo/components/uikit/list/listdemo.component';
import { AuthService } from '../shared/services/auth.service';
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [
    ],
})
export class AppTopBarComponent {

    sendLeaveRequestDate: string;

    leaveRequestMessages: string[] = [];

    submittedData: string | null = null;

    items!: MenuItem[];

    displayPosition: boolean;

    edit: boolean = false;

    position: string;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    @ViewChild('profileMenu') profileMenu!: Menu;

    user = {
        firstname: 'John',
        lastname: 'Doe',
        phone: '1234567890',
        email: 'john_doe@email.com'
    };

    dropdownItems = [
        { name: 'Frontend Developer', code: 'Option 1' },
        { name: 'Backend Developer', code: 'Option 2' },
        { name: 'Fullstack Developer', code: 'Option 3' }
    ];

    profileItems = [
        { label: 'Firstname Lastname', icon: 'pi pi-user' },
        { label: 'Edit', icon: 'pi pi-fw pi-user-edit', command: () => this.edit = true },
        { separator: true },
        { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];

    constructor(public layoutService: LayoutService, private router: Router,
        public NotificationService: NotificationService,
        private authService: AuthService

    ) { }

    toggleMenu(event: Event) {
        this.profileMenu.toggle(event); // เรียกใช้ toggle บน p-menu โดยตรง
    }

    // goToSettings() {
    //     console.log('Navigating to settings...');
    //     // Implement navigation to settings page
    // }

    ngOnInit(): void {
        this.NotificationService.submittedData$.subscribe((data) => {
            this.submittedData = data;
            console.log('Retrieved data from service:', this.submittedData);

            this.createLeaveRequestMessage();
        });
    }

    createLeaveRequestMessage(): void {
        if (this.submittedData) {

            const date = new Date(this.submittedData);
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

            const message = `
                <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                    <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                        <i class="pi pi-user text-xl text-blue-500"></i>
                    </div>
                    <span class="text-900 line-height-3"> Leave Request
                         <span class="text-green-500">${formattedDate}</span>
                        <span class="text-700"> are being reviewed.
                            <span class="text-yellow-500">Currently under investigation</span>
                        </span>
                    </span>
                </li>
            `;

            const isDuplicate = this.leaveRequestMessages.some(existingMessage => existingMessage === message);

            if (!isDuplicate) {
                this.leaveRequestMessages.push(message);

                this.NotificationService.sendLeaveRequestDate(formattedDate);
            } else {
                console.log('ข้อความซ้ำ: ไม่เพิ่มเข้าไปใน leaveRequestMessages');
            }

        }
    }

    showPositionDialog(position: string) {
        this.position = position;
        this.displayPosition = true;
    }

    logout() {
        console.log('Logging out...');
        localStorage.removeItem('app.token');
        sessionStorage.removeItem('app.token');
        sessionStorage.removeItem('UserInfo');
        this.authService.signOut().subscribe(() => {
            this.router.navigate(['account/login']);
        });

    }

}
