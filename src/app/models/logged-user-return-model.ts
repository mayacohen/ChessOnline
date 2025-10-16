export interface LoggedUserReturnModel {
    username:string;
    score: number | null;
    userPic: string;
    isFriend: boolean | null;
    isOnline: boolean;
    dateJoined: string;
}
