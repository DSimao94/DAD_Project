"use strict";
class Game {
    //status 0 = created, 1 = started, 2 = finished, 3 = withdraw
    constructor(_id, name, creator, status, startDate, endDate, winner, players) {
        this._id = _id;
        this.name = name;
        this.creator = creator;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.winner = winner;
        this.players = players;
        this.boards = {};
    }
}
exports.Game = Game;
