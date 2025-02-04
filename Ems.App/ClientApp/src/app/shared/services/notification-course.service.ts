import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificationCourseService  {
    private hubConnection: signalR.HubConnection;

    // Update Edit Proflie User
    private userUpdatedSource = new Subject<any>();
    userUpdated$ = this.userUpdatedSource.asObservable();

    constructor() {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:44346/notificationHub')
            .withAutomaticReconnect() //Auto Reconnect
            .build();

        // Update Edit Proflie User
        this.hubConnection.on('UserUpdated', (updatedUser) => {
            this.userUpdatedSource.next(updatedUser);
        });

        // เมื่อเกิดการตัดการเชื่อมต่อ
        this.hubConnection.onclose(error => {
            console.warn("SignalR Disconnected. Reconnecting in 5 seconds...", error);
            setTimeout(() => this.startConnection(), 5000);
        });
    }

    startConnection(): void {
        if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
            this.hubConnection.start()
                .then(() => console.log('SignalR connected!'))
                .catch(err => console.error('Error connecting to SignalR:', err));
        } 
    }

    // startConnection(): void {
    //     this.hubConnection.start()
    //         .then(() => console.log('SignalR connected!'))
    //         .catch(err => console.error('Error connecting to SignalR:', err));
    // }

    listenNotifications(callback: (message: string) => void) {
        this.hubConnection.on('ReceiveNotification', callback);
    }

}
