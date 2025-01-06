import { CheckingService } from './../shared/services/checking.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';
import { Menu } from 'primeng/menu';
import { ListDemoComponent } from '../demo/components/uikit/list/listdemo.component';
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [
      ],
})
export class AppTopBarComponent {

    leaveRequestMessage: string | null = null;

    submittedData: string | null = null;

    items!: MenuItem[];

    displayPosition: boolean;

    position: string;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    @ViewChild('profileMenu') profileMenu!: Menu;
    profileItems = [
        { label: 'Hi Firstname Lastname', icon: 'pi pi-user' },
        { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];

    constructor(public layoutService: LayoutService, private router: Router,
        public checkingService: CheckingService) { }

    toggleMenu(event: Event) {
        this.profileMenu.toggle(event); // เรียกใช้ toggle บน p-menu โดยตรง
    }

    // goToSettings() {
    //     console.log('Navigating to settings...');
    //     // Implement navigation to settings page
    // }

    ngOnInit(): void {
        this.checkingService.submittedData$.subscribe((data) => {
            this.submittedData = data;
            console.log('Retrieved data from service:', this.submittedData);

            this.createLeaveRequestMessage();
          });
    }

    createLeaveRequestMessage(): void {
        if (this.submittedData) {

            const date = new Date(this.submittedData);  // ถ้า submittedData เป็น string ที่สามารถแปลงได้
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

            this.leaveRequestMessage = `
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
        }
    }

    showPositionDialog(position: string) {
        this.position = position;
        this.displayPosition = true;
    }

    logout() {
        console.log('Logging out...');
        // Implement logout logic, e.g., clear localStorage and redirect to login
        localStorage.clear();
        // Navigate to login page
        this.router.navigate(['/auth/login']);
    }

}
