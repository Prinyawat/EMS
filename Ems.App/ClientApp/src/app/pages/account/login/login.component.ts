import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UserModel } from 'src/app/shared/models/user.modal';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];

    password!: string;
    user: UserModel = new UserModel();
    isError: boolean = false;
    errorMessage: string = null;
    isDirty: boolean = false; 
    emailDirty: boolean = false; // สำหรับ email
    passwordDirty: boolean = false; // สำหรับ password
    


    constructor(private authService: AuthService,
        private router: Router
    ) { }

    signIn() {
        this.isError = false;
        this.isDirty = true;
        this.emailDirty = this.isInvalid(this.user.email); // ตรวจสอบว่าช่อง Email ว่าง
        this.passwordDirty = this.isInvalid(this.user.password); // ตรวจสอบว่าช่อง Password ว่าง
        
        if (!this.user.email || !this.user.password) {
            this.isError = true;
            return;
        }
        console.log('signIn', this.user)
        this.isError = false;
        this.authService.signIn(this.user).subscribe((res: UserModel) => {
            console.log('res', res);
            sessionStorage.setItem('UserInfo', JSON.stringify(res));
            this.setTokenStorage(res.token);
            this.router.navigate(['/home'])
        }, (error) => {
            console.log('err', error);
            this.isError = true;
        })
    }


    setTokenStorage(token) {
        sessionStorage.setItem('app.token', token);
        localStorage.setItem('app.token', token);
    }

    isInvalid(value: string): boolean {
        return !value || value.trim().length === 0;
    }
}
