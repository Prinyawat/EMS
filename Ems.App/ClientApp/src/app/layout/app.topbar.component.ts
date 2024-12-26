import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';
import { Menu } from 'primeng/menu';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    @ViewChild('profileMenu') profileMenu!: Menu;
    profileItems = [
        { label: 'Hi Firstname Lastname', icon: 'pi pi-user' },
        { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];

    constructor(public layoutService: LayoutService, private router: Router) { }

    toggleMenu(event: Event) {
        this.profileMenu.toggle(event); // เรียกใช้ toggle บน p-menu โดยตรง
    }

    // goToSettings() {
    //     console.log('Navigating to settings...');
    //     // Implement navigation to settings page
    // }

    logout() {
        console.log('Logging out...');
        // Implement logout logic, e.g., clear localStorage and redirect to login
        localStorage.clear();
        // Navigate to login page
        this.router.navigate(['/auth/login']);
    }
}
