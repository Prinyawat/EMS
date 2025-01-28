import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    constructor(private http: HttpClient) { }

    env: string = `${environment.apiUrl}/api/Noti`;

    // Function เตรียมส่งข้อมูลไป service backend
    saveData(data: any): Observable<any> {
        return this.http.post(this.env + "/saveData", { date: data })
    }

    //---------------------------------------------------------------------------------------------






    sendLeaveRequestDate(date: any): void {
        console.log('Sending date to service:', date);
    }

    private submittedDataSubject = new BehaviorSubject<any>(null);
    submittedData$ = this.submittedDataSubject.asObservable();

    getSavedData(): any {
        return this.submittedDataSubject.value;
    }
}
