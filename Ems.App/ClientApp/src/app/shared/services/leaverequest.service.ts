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
export class LeaveRequestService {
    constructor(private http: HttpClient) { }

    env: string = `${environment.apiUrl}/api/LeaveRequest`;

    private summittedLeaveRequest = new BehaviorSubject<any>(null);
    submittedLeaveData$ = this.summittedLeaveRequest.asObservable();

    formatDate(date: string | Date): string {
        const dateObject = new Date(date);
        const day = String(dateObject.getUTCDate()).padStart(2, '0');
        const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0');
        const year = dateObject.getUTCFullYear();
        return `${year}-${month}-${day}`;
    }

    saveleaveRequest(formData: any) {
        return this.http.post(this.env + "/saveleaveRequest", formData).pipe(
            tap((result: any) => {
                this.summittedLeaveRequest.next(result);
            })
        );
    }

    sendLeaveRequestDate(request: any): void {
    }

    getLeaveRequestNoti() {
        return this.http.get(this.env + "/getLeaveRequestNoti");
    }

    getLeaveRequestHalfStatus() {
        return this.http.get(this.env + "/getLeaveRequestHalfStatus");
    }

    getLeaveRequestStatus() {
        return this.http.get(this.env + "/getLeaveRequestStatus");
    }
}

