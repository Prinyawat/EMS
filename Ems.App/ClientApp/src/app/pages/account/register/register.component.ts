import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { PositionModel } from 'src/app/shared/models/user.modal';

import { RegisterService } from 'src/app/shared/services/Register.service';

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
    `],
    providers: [MessageService]
})
export class RegisterComponent {

    valCheck: string[] = ['remember'];

    firstName!: string;
    lastName!: string;
    phone!: string;
    email!: string;
    password!: string;

    firstNameDirty: boolean = false;
    lastNameDirty: boolean = false;
    phoneDirty: boolean = false;
    emailDirty: boolean = false;
    passwordDirty: boolean = false;

    positions: PositionModel[] = []; 
    selectedPosition: PositionModel | null = null;

    constructor(
        public layoutService: LayoutService,
        private registerService: RegisterService, 
        private router: Router,
        private messageService: MessageService,
    ) {}

    ngOnInit(){
        this.registerService.getPosition().subscribe({
            next: (data: PositionModel[]) => {
                this.positions = data;
            }
        })

    }

    validateForm() {
        this.firstNameDirty = !this.firstName;
        this.lastNameDirty = !this.lastName;
        this.phoneDirty = !this.phone;
        this.emailDirty = !this.email;
        this.passwordDirty = !this.password;
    
        if (!this.firstName || !this.lastName || !this.phone || !this.email || !this.password) {
            return;
        }
    
        const newUser = {
            Firstname: this.firstName,
            Lastname: this.lastName,
            phone: this.phone,
            Email: this.email,
            Password: this.password,
            positionId: this.selectedPosition?.positionId || null
        };
    
        this.registerService.registerUser(newUser).subscribe({
            next: () => {
                this.showSuccessViaToast();  
                setTimeout(() => {
                    this.router.navigate(['/account/login']); 
                }, 1500);
            }
        });
    }
    showSuccessViaToast() {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'ลงทะเบียนสำเร็จ', detail: 'บัญชีของคุณถูกสร้างขึ้นเรียบร้อยแล้ว!' });
    }
    
}
