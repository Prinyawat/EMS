import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class NotificationCourseService  {
    private hubConnection: signalR.HubConnection;

    constructor() {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:44346/notificationHub')
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
