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
    firstName: string;
    lastName: string;
    checkingDate: Date;
    startTime: string;
    endTime: string;
    selectedLeaveHalfStatus: string;
    leaveStatus: string;
    additionalDescription: string;
}
