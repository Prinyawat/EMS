import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckCustomer } from './check-customers';

@Injectable()
export class AgendaService {

    constructor(public http: HttpClient) { }
    // assets/demo/data/customers-large.json
    getCustomersAgenda() {
            return this.http.get<any>('assets/customer-checking/customers-checking.ts')
                .toPromise()
                .then(res => res.data as CheckCustomer[])
                .then(data => data);
        }
}
