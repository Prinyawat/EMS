import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckingService {

    sendLeaveRequestDate(date: any): void {
        console.log('Sending date to service:', date);
    }

    private submittedDataSubject = new BehaviorSubject<any>(null);
    submittedData$ = this.submittedDataSubject.asObservable();

    saveData(data: any): void {
      this.submittedDataSubject.next(data);
      console.log('Data saved:', data);
    }

    getSavedData(): any {
      return this.submittedDataSubject.value;
    }
}
