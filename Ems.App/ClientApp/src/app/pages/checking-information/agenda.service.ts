import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckCustomer } from './check-customers';


@Injectable()
export class AgendaService {

    constructor(private http: HttpClient) { }
    // assets/demo/data/customers-large.json
    getCustomersAgendar() {
        return this.http.get<any>('assets/customer-checking/customers-checking.json')
            .toPromise()
            .then(res => res.data as CheckCustomer[])
            .then(data => data);
    }
}
