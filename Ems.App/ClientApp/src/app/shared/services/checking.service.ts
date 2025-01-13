import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckingService {
    constructor(private http: HttpClient){}

    env: string = `${environment.apiUrl}/api/Noti`;

      // Function เตรียมส่งข้อมูลไป service backend
    saveData(data: any): Observable<any> {
        return this.http.post(this.env + "/saveData", { date: data })
    }

    saveChecking(data: { timestamp: Date }) {
        const timestamp = data.timestamp.toLocaleTimeString('en-GB', { hour12: false });
        return this.http.post(this.env + "/saveChecking", timestamp);
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
