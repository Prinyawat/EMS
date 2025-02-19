export class LeaveRequest {
    startDate: string;
    endDate: string;
    status: string;
}

export class LeaveStatusData {
    leaveStatusId:string;
    leaveStatusData: string;
}

export class LeaveHalfStatus {
    leaveHalfId: string;
    halfStatus: string;
}

export class NotiAgenda{
    agendaStatusId: string;
    leaveRequestID: string;
    userID: string;
    firstName: string;
    lastName: string;
    checkingDate: Date;
    startTime: Date;
    endTime: Date;
    selectedLeaveHalfStatus: string;
    leaveStatus: string;
    additionalDescription: string;
}

export class HeaderAgenda{
    firstName: string;
    lastName: string;
}
