import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, catchError, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private hubConnection: signalR.HubConnection;

    private userUpdatedSource = new Subject<any>();
        userUpdated$ = this.userUpdatedSource.asObservable();

    constructor(private http: HttpClient) {
        this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl('https://localhost:44346/notificationHub')
                .build();

            this.hubConnection.on('UserUpdated', (updatedUser) => {
                this.userUpdatedSource.next(updatedUser);
        });

     }

    env: string = `${environment.apiUrl}/api/Noti`;

    saveData(data: any): Observable<any> {
        return this.http.post(this.env + "/saveData", { date: data })
    }


    //--------------------------------------------------------------------------------------------

    private submittedDataSubject = new BehaviorSubject<any>(null);
    submittedData$ = this.submittedDataSubject.asObservable();

    getSavedData(): any {
        return this.submittedDataSubject.value;
    }
}
