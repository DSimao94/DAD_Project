import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Game} from "../model/Game";

const BASE_URL = 'http://localhost:8080/api/v1/';

@Injectable()
export class GameService {

    constructor(private http: Http) {
    }

    get(gameId: string) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        let url = BASE_URL + 'games/' + gameId;
        return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then(r => this.handleResponse(r.json()))
            .catch(r => this.handleError());
    }

    create(game: Game) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        delete game._id;
        let url = BASE_URL + "games";
        return this.http
            .post(url, JSON.stringify(game), {headers: headers})
            .toPromise()
            .then(r => this.handleResponse(r.json()))
            .catch(r => this.handleError());
    }

    update(game: Game) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        let url = BASE_URL + "games/" + game._id;
        return this.http
            .put(url, JSON.stringify(game), {headers: headers})
            .toPromise()
            .then(r => this.handleResponse(r.json()))
            .catch(r => this.handleError());
    }

    deleteGame(game_id: string) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        let url = BASE_URL + "games/" + game_id;
        return this.http
            .delete(url, {headers: headers})
            .toPromise()
            .then(r => this.handleResponse(r.json()))
            .catch(r => this.handleError());
    }

    getLobbyGames() {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        let lobbyGames = BASE_URL + "games";
        return this.http
            .get(lobbyGames, {headers: headers})
            .toPromise()
            .then(r => this.handleResponse(r.json()))
            .catch(r => this.handleError());
    }

    getHistoryGames() {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        let historyGames = BASE_URL + "games-history";
        return this.http
            .get(historyGames, {headers: headers})
            .toPromise()
            .then(r => this.handleResponse(r.json()))
            .catch(r => this.handleError());
    }

    private handleResponse(data: any): Promise<any> {
        return Promise.resolve(data);
    }

    private handleError(): Promise<any> {
        return Promise.resolve({Error: true, message: 'internal error'});
    }
}