import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(private http: HttpClient) { }
    env: string = `${environment.apiUrl}/api/`;// "https://localhost:44361/api/"

    signIn(credentials) {
        console.log('env', this.env);
        return this.http.post(this.env + "User/login", credentials)

    }

    signOut() {
        return from(["empty"]);
    }

    getUser() {
        return this.http.get(this.env + `User/getUser`);
    }
    
    updateUser(updatedUser: any) {
        return this.http.put(this.env + `User/updateUser`, updatedUser);
    }
    

    // getUser(userId: string) {
    //     return this.http.get(this.env + `User/getUser/${userId}`);
    // }

    // updateUser(userId: string, updatedUser: any) {
    //     return this.http.put(this.env + `User/updateUser/${userId}`, updatedUser);
    // }

    // getUserMenu(user) {
    //     return this.http.post(this.env + "Menu/getMenu", user)
    // }

}