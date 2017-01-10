export class User {
    _id: string;
    username: string;
    email: string;
    password: string;
    totalVictories: number;
    totalPoints: number;
    token: string;
    avatar: string;

    constructor(_id: string, username: string, email: string, password: string, totalVictories: number, totalPoints: number) {
        this._id = _id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.totalVictories = totalVictories;
        this.totalPoints = totalPoints;
    }
}