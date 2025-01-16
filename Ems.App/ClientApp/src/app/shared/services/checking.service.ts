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
        // const timestamp = data.timestamp.toLocaleTimeString('en-GB', { hour12: false });
        return this.http.post(this.env + "/saveChecking", {timestamp: Date, status: data.status}).pipe(
            tap((result: any) => {
                this.summittedChecking.next(result);
            })
        );
    }

}

