import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SignalRService {
    private connection: signalR.HubConnection;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:44346/datahub')
            .build();
    }

    startConnection(): void {
        this.connection.start()
            .then(() => console.log('SignalR connected!'))
            .catch(err => console.error('Error connecting to SignalR:', err));
    }

    onReceiveMessage(callback: (user: string, message: string) => void): void {
        this.connection.on('ReceiveMessage', callback);
    }

    sendMessage(user: string, message: string): void {
        this.connection.invoke('SendMessage', user, message)
            .catch(err => console.error(err));
    }
}
