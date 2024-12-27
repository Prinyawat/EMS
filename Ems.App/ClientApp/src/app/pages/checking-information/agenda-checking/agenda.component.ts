import { Component} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Representative } from 'src/app/demo/api/customer';
import { ProductService } from 'src/app/demo/service/product.service';
import { AgendaService } from '../agenda.service';
import { CheckCustomer } from '../check-customers';
@Component({
    selector: 'app-agenda',
    templateUrl: './agenda.component.html',
    providers: [AgendaService, ProductService]
})
export class AgendaComponent {
    breadcrumbItems: MenuItem[] = [];

    menuItems: MenuItem[] = [];

    rowGroupMetadata: any;

    representatives: Representative[] = [];

    statuses: any[] = [];

    customers3: CheckCustomer[] = [];

    // ChatGPT Helper ควรกลับมาศึกษาจุดนี้ col -> resolvefiled
    cols = [
        { field: 'representative.name', header: 'Representative'},
        { field: 'name', header: 'Name' },
        { field: 'country.name', header: 'Country' },
        { field: 'company', header: 'Company' },
        { field: 'date', header: 'Date' },
        { field: 'status', header: 'Status' }
    ];

    resolveField(data: any, field: string): any {
        return field.split('.').reduce((obj, key) => (obj ? obj[key] : null), data);
    }

    constructor(private AgendaService: AgendaService, private productService: ProductService) { }

    ngOnInit() {
        this.breadcrumbItems = [];
        this.breadcrumbItems.push({ label: 'Check Information' });
        this.breadcrumbItems.push({ label: 'Checking' });
        this.breadcrumbItems.push({ label: 'User Agenda' });

        this.AgendaService.getCustomersAgendar().then(customers => this.customers3 = customers);

        this.representatives = [
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'XuXue Feng', image: 'xuxuefeng.png' }
        ];

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Approve', value: 'Approve' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ];

    }

    onSort() {
        this.updateRowGroupMetaData();
    }

    updateRowGroupMetaData() {
    this.rowGroupMetadata = {};

        if (this.customers3) {
            for (let i = 0; i < this.customers3.length; i++) {
                const rowData = this.customers3[i];
                const representativeName = rowData?.representative?.name || '';

                if (i === 0) {
                    this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
                }
                else {
                    const previousRowData = this.customers3[i - 1];
                    const previousRowGroup = previousRowData?.representative?.name;
                    if (representativeName === previousRowGroup) {
                        this.rowGroupMetadata[representativeName].size++;
                    }
                                else {
                        this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
                        }
                    }
                }
            }
    }

}
