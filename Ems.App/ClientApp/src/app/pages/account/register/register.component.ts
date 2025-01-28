import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class RegisterComponent {

    valCheck: string[] = ['remember'];

    firstName!: string;
    lastName!: string;
    phone!: string;
    email!: string;
    password!: string;
    position!: string;

    firstNameDirty: boolean = false;
    lastNameDirty: boolean = false;
    phoneDirty: boolean = false;
    emailDirty: boolean = false;
    passwordDirty: boolean = false;

    positions = [
        { label: 'Frontend Developer', value: 'frontend' },
        { label: 'Backend Developer', value: 'backend' },
        { label: 'Fullstack Developer', value: 'fullstack' },
        { label: 'Mobile Developer', value: 'mobile' },
        { label: 'DevOps Engineer', value: 'devops' }
    ];

    constructor(public layoutService: LayoutService) { }

    validateForm() {
        this.firstNameDirty = !this.firstName;
        this.lastNameDirty = !this.lastName;
        this.phoneDirty = !this.phone;
        this.emailDirty = !this.email;
        this.passwordDirty = !this.password;

        if (!this.firstName || !this.lastName || !this.phone || !this.email || !this.password) {
        } 
    }
}
