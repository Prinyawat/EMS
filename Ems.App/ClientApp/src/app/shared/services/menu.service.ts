import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class MenuService {

    constructor(private http: HttpClient) { }

    env: string = `${environment.apiUrl}/api/Menu`;

    getMenus() {
        console.log(this.env + "/getMenus")
        return this.http.get(this.env + "/getMenus");
    }
}
