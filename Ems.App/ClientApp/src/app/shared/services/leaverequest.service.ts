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

    private LeaveHalfStatus = new BehaviorSubject<any>(null);
    LeaveHalfStatus$ = this.LeaveHalfStatus.asObservable();

    formatDate(date: string | Date): string {
        const dateObject = new Date(date); // รองรับ string และ Date
        const day = String(dateObject.getUTCDate()).padStart(2, '0'); // ใช้ UTC Date
        const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0'); // ใช้ UTC Month
        const year = dateObject.getUTCFullYear(); // ใช้ UTC Year
        return `${year}-${month}-${day}`; // รูปแบบ YYYY-MM-DD
    }

    saveleaveRequest(request: { startDate: string; endDate: string; status: string }) {

        const startDateFormatted = this.formatDate(new Date(request.startDate));
        const endDateFormatted = this.formatDate(new Date(request.endDate));

        return this.http.post(this.env + "/saveleaveRequest", {
            startDate: startDateFormatted,
            endDate: endDateFormatted,
            status: request.status
        }).pipe(
            tap((result: any) => {
                this.summittedLeaveRequest.next(result);
            })
        );
    }

    saveleaveHalf(request: {halfStatus: string}){
        return this.http.post(this.env + "/saveleaveHalf", {
             halfStatus: request.halfStatus}).pipe(
            tap((resultstatus: any) => {
                this.LeaveHalfStatus.next(resultstatus);
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

