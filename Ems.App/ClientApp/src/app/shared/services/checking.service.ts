import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckingService {
    // public submittedData: any = null;

    // saveData(data: any): void {
    //   this.submittedData = data;
    //   console.log('Data saved:', this.submittedData);
    // }

    // getSavedData(): any {
    //   return this.submittedData;
    // }

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
