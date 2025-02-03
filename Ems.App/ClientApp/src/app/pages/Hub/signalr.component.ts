import { Component, OnInit } from '@angular/core';
import { SignalRService } from 'src/app/shared/services/signalr.service';

@Component({
    selector: 'app-signalr',
    templateUrl: './signalr.component.html',
})
export class SignalRComponent implements OnInit {
    username = '';
    message = '';
    messages: string[] = [];

    constructor(private SignalRService: SignalRService) {}

    ngOnInit(): void {
        this.SignalRService.startConnection();

        this.SignalRService.onReceiveMessage((user, message) => {
            this.messages.push(`${user}: ${message}`);
        });
    }

    sendMessage(): void {
        this.SignalRService.sendMessage(this.username, this.message);
        this.message = '';
    }
}
