export class LeaveRequest {
    startDate: string;
    endDate: string;
    status: string;
    FileUpload: File;
}

export class LeaveStatusData {
    leaveStatusId:string;
    leaveStatusData: string;
}

export class LeaveHalfStatus {
    leaveHalfId: string;
    halfStatus: string;
}
