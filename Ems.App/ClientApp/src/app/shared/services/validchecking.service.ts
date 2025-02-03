import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, catchError, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ValidCheckingService {
    private hubConnection: signalR.HubConnection;

    constructor(private http: HttpClient) {
        this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl('https://localhost:44346/validcheckingTime')
                .build();
    }

    startConnection(): void {
        this.hubConnection.start()
            .then(() => console.log('SignalR connected!'))
            .catch(err => console.error('Error connecting to SignalR:', err));
    }

    listenNotifications(callback: (message: string) => void) {
        this.hubConnection.on('ReceiveNotification', callback);
    }

}
