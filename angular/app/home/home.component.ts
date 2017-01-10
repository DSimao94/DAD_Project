import {Component} from '@angular/core';
import {User} from "../model/User";
import {UserService} from "../services/user.service";
import {GameService} from "../services/game.service";
import {Router} from "@angular/router";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Game} from "../model/Game";
import {WebSocketService} from "../services/websocket.service";
import {CookieService} from 'angular2-cookie/core';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent {
    games: Game[] = [];
    historyGames: Game[] = [];
    top10V: User[];
    top10P: User[];
    usernames: any;
    historyUsernames: any;
    message: string;
    gameName: string;
    chatChannel: any[] = [];
    complexForm: FormGroup;
    complexForm1: FormGroup;
    userSet: boolean = false;

    constructor(private fb: FormBuilder, private fb1: FormBuilder, private router: Router, private userService: UserService,
                private gameService: GameService, private websocketService: WebSocketService, private _cookieService: CookieService) {
        this.complexForm = fb.group({
            'name': [null, Validators.required],
        });
        this.complexForm1 = fb1.group({
            'message': [null, Validators.required],
        });
        let s = decodeURIComponent(this.getCookie('token')).split('#');
        if (!this.userSet) {
            this.userService
                .get(s[1], s[0])
                .then((r) => {
                    localStorage.setItem('user', JSON.stringify(r));
                    this.userSet = true;
                    this.init();
                });
        } else {
            this.init();
        }
    }

    getCookie(key: string) {
        return this._cookieService.get(key);
    }

    init() {
        this.websocketService.sendNotificationMessageToAll(this.getAuthUser().username + ' logged in');
        this.getGames();
        this.getHistoryGames();
        this.getTop10Victories();
        this.getTop10Points();
        this.websocketService.getChatMessages().subscribe((m: any) => {
            this.chatChannel.push({user: m[0], message: m[1]});
        });
        this.websocketService.getStartGame().subscribe((gameId: any) => {
            this.router.navigate(['/game', {'id': gameId}]);
        });
        this.websocketService.getUpdatedList().subscribe(() => {
            this.getGames();
        });
    }

    logOut(): void {
        this.websocketService.sendNotificationMessageToAll(this.getAuthUser().username + ' logged out');
        this.userService
            .logOut()
            .then(() => {
                this.router.navigate(['/'])
            });
    }

    getAuthUser(): User {
        return JSON.parse(localStorage.getItem('user')) == null ? {username: 'username'} : JSON.parse(localStorage.getItem('user'));
    }

    createGame(value: any): void {
        let game = new Game('', value.name, this.getAuthUser()._id, 0, null, null, '', []);
        this.gameService
            .create(game)
            .then(r => {
                this.websocketService.joinGame(r._id);
                r.players.push({player: this.getAuthUser()._id, score: 0});
                this.gameService
                    .update(r)
                    .then(() => {
                        this.updateGamesList();
                        this.gameName = '';
                        this.websocketService.sendNotificationMessageToAll(this.getAuthUser().username + ' created a game');
                        this.websocketService.sendNotificationMessageToUser('You created a game');
                    });
            });
    }

    joinGame(game: Game): void {
        if (game.players.length < 4) {
            this.websocketService.joinGame(game._id);
            game.players.push({player: this.getAuthUser()._id, score: 0});
            this.gameService
                .update(game)
                .then(() => {
                    this.updateGamesList();
                    this.websocketService.sendNotificationMessageToAll(this.getAuthUser().username + ' joined a game');
                    this.websocketService.sendNotificationMessageToUser('You joined a game');
                });
        }
    }

    leaveGame(game: Game): void {
        if (game.players.length > 1) {
            this.websocketService.leaveGame(game._id);
            game.players.forEach((item, index, object) => {
                if (item.player === this.getAuthUser()._id) {
                    object.splice(index, 1);
                }
            });
            this.gameService
                .update(game)
                .then(() => {
                    this.updateGamesList();
                    this.websocketService.sendNotificationMessageToAll(this.getAuthUser().username + ' left a game');
                    this.websocketService.sendNotificationMessageToUser('You left a game');
                });
        }
    }

    startGame(game: Game): void {
        game.status = 1;
        game.startDate = new Date();
        this.gameService
            .update(game)
            .then(() => {
                this.websocketService.startGame(game);
                this.websocketService.sendNotificationMessageToAll(this.getAuthUser().username + ' started a game');
                this.websocketService.sendNotificationMessageToUser('You started a game');
            });
    }

    endGame(game: Game): void {
        this.gameService
            .deleteGame(game._id)
            .then(() => {
                this.updateGamesList();
                this.websocketService.sendNotificationMessageToAll(this.getAuthUser().username + ' ended a game');
                this.websocketService.sendNotificationMessageToUser('You ended a game');
            });
    }

    filterGames(search: string, searchBy: string, myGames: string) {
        if (search == '') {
            this.getHistoryGames();
        } else {
            this.gameService
                .getHistoryGames()
                .then(r => {
                    this.historyGames = r.games;
                    this.historyUsernames = r.usernames;
                    switch (searchBy) {
                        case 'gameName':
                            if (myGames) {
                                this.historyGames = this.historyGames.filter(el => {
                                    return el.name.includes(search) && el.creator == this.getAuthUser()._id;
                                });
                            } else {
                                this.historyGames = this.historyGames.filter(el => {
                                    return el.name.includes(search);
                                });
                            }
                            break;
                        case 'createdBy':
                            if (myGames) {
                                this.historyGames = this.historyGames.filter(el => {
                                    return this.getHistoryUsernameById(el.creator).includes(search) && el.creator == this.getAuthUser()._id;
                                });
                            } else {
                                this.historyGames = this.historyGames.filter(el => {
                                    return this.getHistoryUsernameById(el.creator).includes(search);
                                });
                            }
                            break;
                        case 'status':
                            if (myGames) {
                                this.historyGames = this.historyGames.filter(el => {
                                    return el.status == +search && el.creator == this.getAuthUser()._id;
                                });
                            } else {
                                this.historyGames = this.historyGames.filter(el => {
                                    return el.status == +search;
                                });
                            }
                            break;
                        case 'startDate':
                            if (myGames) {
                                this.historyGames = this.historyGames.filter(el => {
                                    return this.formatDate(el.startDate.toString()).includes(search) && el.winner == this.getAuthUser()._id;
                                });
                            } else {
                                this.historyGames = this.historyGames.filter(el => {
                                    return this.formatDate(el.startDate.toString()).includes(search);
                                });
                            }
                            break;
                        case 'endDate':
                            if (myGames) {
                                this.historyGames = this.historyGames.filter(el => {
                                    return this.formatDate(el.endDate.toString()).includes(search) && el.winner == this.getAuthUser()._id;
                                });
                            } else {
                                this.historyGames = this.historyGames.filter(el => {
                                    return this.formatDate(el.endDate.toString()).includes(search);
                                });
                            }
                            break;
                        case 'winner':
                            if (myGames) {
                                this.historyGames = this.historyGames.filter(el => {
                                    return this.getHistoryUsernameById(el.winner).includes(search) && el.winner == this.getAuthUser()._id;
                                });
                            } else {
                                this.historyGames = this.historyGames.filter(el => {
                                    return this.getHistoryUsernameById(el.winner).includes(search);
                                });
                            }
                            break;
                        case 'players':
                            if (myGames) {
                                this.historyGames = this.historyGames.filter(el => {
                                    let bool = false;
                                    for (let i = 0; i < el.players.length; i++) {
                                        if (this.getHistoryUsernameById(el.players[i].player).includes(search) && el.winner == this.getAuthUser()._id) {
                                            bool = true;
                                        }
                                    }
                                    return bool;
                                });
                            } else {
                                this.historyGames = this.historyGames.filter(el => {
                                    let bool = false;
                                    for (let i = 0; i < el.players.length; i++) {
                                        if (this.getHistoryUsernameById(el.players[i].player).includes(search)) {
                                            bool = true;
                                        }
                                    }
                                    return bool;
                                });
                            }
                            break;
                    }
                });
        }
    }

    userInGame(game: Game): boolean {
        let bool = false;
        game.players.forEach(p => {
            if (p.player === this.getAuthUser()._id) {
                bool = true;
            }
        });
        return bool;
    }

    updateGamesList() {
        this.websocketService.updateGamesList();
    }

    getGames(): void {
        this.gameService
            .getLobbyGames()
            .then(r => {
                this.games = r.games;
                this.usernames = r.usernames;
            });
    }

    getHistoryGames(): void {
        this.gameService
            .getHistoryGames()
            .then(r => {
                this.historyGames = r.games;
                this.historyUsernames = r.usernames;
            });
    }

    getTop10Victories() {
        this.userService
            .getTop10Victories()
            .then(r => this.top10V = r);
    }

    getTop10V(): User[] {
        return this.top10V;
    }

    getTop10Points() {
        this.userService
            .getTop10Points()
            .then(r => this.top10P = r);
    }

    getTop10P(): User[] {
        return this.top10P;
    }

    getUsernameById(id: string): string {
        return this.usernames[id];
    }

    getHistoryUsernameById(id: string): string {
        return this.historyUsernames[id];
    }

    hasGames(): boolean {
        return this.games.length > 0;
    }

    sendMessage(value: any): void {
        this.websocketService.sendChatMessage(value.message);
        this.message = '';
    }

    goProfile(): void {
        this.router.navigate(['/profile']);
    }

    goLobby(): void {
        this.router.navigate(['/home']);
    }

    formatDate(date: string): string {
        if (date) {
            let parts = date.split('T');
            let d = parts[0].split('-');
            let day = d[2];
            let month = d[1];
            let year = d[0];

            let time = parts[1].split(':');
            let mins = time[1];
            let hours = time[0];

            return `${day}-${month}-${year} ${hours}:${mins}`;
        } else {
            return '';
        }
    }
}