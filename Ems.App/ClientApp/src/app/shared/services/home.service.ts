import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class HomeService {
    constructor(private http: HttpClient) { }

    env: string = `${environment.apiUrl}/api/Home`;

    getItems() {
        console.log(this.env + "/getItems")
        return this.http.get(this.env + "/getItems");
    }
}
