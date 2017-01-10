export class Game {
    _id: string;
    name: string;
    creator: string;
    status: number;
    startDate: Date;
    endDate: Date;
    winner: string;
    players: any[]; // { player: 72347534, score: 4546}   To get the player score:  game.players[index].score    index is the number of players: 0, 1, 2, 3
    boards: {};
    nextPlayer: string;

    //status 0 = created, 1 = started, 2 = finished, 3 = withdraw
    constructor(_id: string, name: string, creator: string, status: number, startDate: Date, endDate: Date, winner: string, players: any[]) {
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