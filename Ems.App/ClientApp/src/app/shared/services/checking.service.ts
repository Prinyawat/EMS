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
    saveChecking(data: { checkin: Date | null, checkout: Date | null, status: string;}){
        return this.http.post(this.env + "/saveChecking", {
            checkin: data.checkin,
            checkout: data.checkout,
            status: data.status
        }).pipe(
            tap((result: any) => {
                this.summittedChecking.next(result);
            })
        );
    }

    getCheckinStatus() {
        return this.http.get(this.env + "/getCheckinStatus");
    }

    getAgendas() {
        return this.http.get(this.env + "/getAgendas");
    }

}

