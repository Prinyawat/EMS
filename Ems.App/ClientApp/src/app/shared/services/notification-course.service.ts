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
            .build();

        // Update Edit Proflie User 
        this.hubConnection.on('UserUpdated', (updatedUser) => {
            this.userUpdatedSource.next(updatedUser); 
        });
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
