import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class RegisterService {

    constructor(
      private http: HttpClient
    ) {}

    env: string = `${environment.apiUrl}/api/Register`;

    getPosition(){
      return this.http.get(this.env + "/getPosition");
    }   

    registerUser(newUser: any){
      return this.http.post(`${this.env}/register`, newUser);
    }

}
