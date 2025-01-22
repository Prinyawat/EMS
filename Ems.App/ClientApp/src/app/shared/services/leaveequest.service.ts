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
    submittedData$ = this.summittedLeaveRequest.asObservable();

    saveleaveRequest(request: { startDate: string; endDate: string; status: string }){
        return this.http.post(this.env + "/saveleaveRequest", {
            startDate: request.startDate,
            endDate: request.endDate,
            status: request.status}).pipe(
            tap((result: any) => {
                this.summittedLeaveRequest.next(result);
            })
        );
    }

    leaveRequestStatus = [
        { label: 'SickLeave', value: 'sickleave' },
        { label: 'StudyLeave', value: 'studyleave' },
        { label: 'AnnualLeave', value: 'annualleave' },
        { label: 'PersonalLeave', value: 'personalleave' },
        { label: 'MaternityLeave', value: 'maternityleave'},
    ];

    getLeaveRequestStatus() {
        return this.leaveRequestStatus;
    }
}

