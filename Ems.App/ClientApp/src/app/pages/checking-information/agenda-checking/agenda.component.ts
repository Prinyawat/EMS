import { Component, ElementRef, ViewChild} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table/table';
import { customeragenda } from 'src/app/pages/checking-information/customer-checking/customers-checking';

@Component({
    selector: 'app-agenda',
    templateUrl: './agenda.component.html',
    providers: []
})
export class AgendaComponent {

    breadcrumbItems: MenuItem[] = [];

    statuses: any[] = [];

    loading: boolean = true;

    customeragenda = customeragenda;

    @ViewChild('filter') filter!: ElementRef;

    // @ViewChild('filter') filter!: ElementRef;

    // ChatGPT Helper ควรกลับมาศึกษาจุดนี้ col -> resolvefiled
    // cols = [
    //     { field: 'representative.name', header: 'Representative'},
    //     { field: 'name', header: 'Name' },
    //     { field: 'country.name', header: 'Country' },
    //     { field: 'company', header: 'Company' },
    //     { field: 'date', header: 'Date' },
    //     { field: 'status', header: 'Status' }
    // ];

    // resolveField(data: any, field: string): any {
    //     return field.split('.').reduce((obj, key) => (obj ? obj[key] : null), data);
    // }

    constructor() { }

    ngOnInit() {
        this.breadcrumbItems = [];
        this.breadcrumbItems.push({ label: 'Check Information' });
        this.breadcrumbItems.push({ label: 'Checking' });
        this.breadcrumbItems.push({ label: 'User Agenda' });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
            table.clear();
            this.filter.nativeElement.value = '';
        }
}
