import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalRComponent } from './signalr.component';

@NgModule({
    declarations: [SignalRComponent],
    imports: [CommonModule,
        FormsModule,
    ],
    exports: [SignalRComponent],
})
export class SignalRModule {}
