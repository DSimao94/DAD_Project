"use strict";
class User {
    constructor(_id, username, email, password, totalVictories, totalPoints) {
        this._id = _id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.totalVictories = totalVictories;
        this.totalPoints = totalPoints;
    }
}
exports.User = User;
