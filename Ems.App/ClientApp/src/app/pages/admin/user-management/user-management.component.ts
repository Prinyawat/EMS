import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { UserModel } from 'src/app/shared/models/user.modal';
import { AuthService } from 'src/app/shared/services/auth.service';


@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    // styleUrls: ['./user-management.component.scss'],
    providers: [MessageService]

})
export class UserManagementComponent implements OnInit {

    users: UserModel[] = [];

    editMode: boolean = true;
    loading: boolean = false;
    display: boolean = false;

    constructor(
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.loading = true;
        this.authService.getAllUser().subscribe((x: UserModel[]) => {
            if (x) {
                this.users = x;
                console.log('users', this.users);
                this.loading = false;
            }
        })
    }

    showDialog() {

    }



    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    editCourse(user) { }
    confirmDeleteViaToast(event, userId) { }
}
