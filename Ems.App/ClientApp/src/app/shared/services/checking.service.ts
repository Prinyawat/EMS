import {
    HttpClient
} from '@angular/common/http';
import {
    Injectable
} from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    Observable,
    tap
} from 'rxjs';
import {
    environment
} from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CheckingService {

    constructor(private http: HttpClient) { }

    env: string = `${environment.apiUrl}/api/Checking`;

    private summittedChecking = new BehaviorSubject<any>(null);
    submittedData$ = this.summittedChecking.asObservable();
    saveChecking(data: { timestamp: Date, status: string;}){
        return this.http.post(this.env + "/saveChecking", {timestamp: Date, status: data.status}).pipe(
            tap((result: any) => {
                this.summittedChecking.next(result);
            })
        );
    }
    getAgendas() {
        return this.http.get(this.env + "/getAgendas");
    }

    workStatus = [
        { label: 'WorkIn', value: 'workin' },
        { label: 'WorkFromHome', value: 'workfromhome' },
      ];

    getWorkStatus() {
        return this.workStatus;
    }
}

