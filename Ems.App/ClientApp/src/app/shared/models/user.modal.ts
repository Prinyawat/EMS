export class UserModel {
    userId: string;
    positionName: string;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    password: string;
    token: string;
    refreshToken: string;
}

export class PositionModel {
    positionId: string;
    positionName: string;
}