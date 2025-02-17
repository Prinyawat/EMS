import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AdminLeaveRequestService {

    constructor(
        private http: HttpClient
    ) { }

    env: string = `${environment.apiUrl}/api/LeaveRequest`;

    deleteLeaveRequest(data: { leaveRequestID: string }) {
        return this.http.delete(`${this.env}/deleteLeaveRequest/${data.leaveRequestID}`);
    }

    saveAgendaApprove(agendaApprove: { agendaStatusId: string, leaveRequestID: string;}) {
        return this.http.post(this.env + "/saveAgendaApprove", {
            agendaStatusId: agendaApprove.agendaStatusId,
            leaveRequestID: agendaApprove.leaveRequestID
        });
    }

}
