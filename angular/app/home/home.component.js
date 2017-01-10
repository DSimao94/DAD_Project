"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var user_service_1 = require("../services/user.service");
var game_service_1 = require("../services/game.service");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var Game_1 = require("../model/Game");
var websocket_service_1 = require("../services/websocket.service");
var core_2 = require("angular2-cookie/core");
var HomeComponent = (function () {
    function HomeComponent(fb, fb1, router, userService, gameService, websocketService, _cookieService) {
        var _this = this;
        this.fb = fb;
        this.fb1 = fb1;
        this.router = router;
        this.userService = userService;
        this.gameService = gameService;
        this.websocketService = websocketService;
        this._cookieService = _cookieService;
        this.games = [];
        this.historyGames = [];
        this.chatChannel = [];
        this.userSet = false;
        this.complexForm = fb.group({
            'name': [null, forms_1.Validators.required],
        });
        this.complexForm1 = fb1.group({
            'message': [null, forms_1.Validators.required],
        });
        var s = decodeURIComponent(this.getCookie('token')).split('#');
        if (!this.userSet) {
            this.userService
                .get(s[1], s[0])
                .then(function (r) {
                localStorage.setItem('user', JSON.stringify(r));
                _this.userSet = true;
                _this.init();
            });
        }
        else {
            this.init();
        }
    }
    HomeComponent.prototype.getCookie = function (key) {
        return this._cookieService.get(key);
    };
    HomeComponent.prototype.init = function () {
        var _this = this;
        this.websocketService.sendNotificationMessageToAll(this.getAuthUser().username + ' logged in');
        this.getGames();
        this.getHistoryGames();
        this.getTop10Victories();
        this.getTop10Points();
        this.websocketService.getChatMessages().subscribe(function (m) {
            _this.chatChannel.push({ user: m[0], message: m[1] });
        });
        this.websocketService.getStartGame().subscribe(function (gameId) {
            _this.router.navigate(['/game', { 'id': gameId }]);
        });
        this.websocketService.getUpdatedList().subscribe(function () {
            _this.getGames();
        });
    };
    HomeComponent.prototype.logOut = function () {
        var _this = this;
        this.websocketService.sendNotificationMessageToAll(this.getAuthUser().username + ' logged out');
        this.userService
            .logOut()
            .then(function () {
            _this.router.navigate(['/']);
        });
    };
    HomeComponent.prototype.getAuthUser = function () {
        return JSON.parse(localStorage.getItem('user')) == null ? { username: 'username' } : JSON.parse(localStorage.getItem('user'));
    };
    HomeComponent.prototype.createGame = function (value) {
        var _this = this;
        var game = new Game_1.Game('', value.name, this.getAuthUser()._id, 0, null, null, '', []);
        this.gameService
            .create(game)
            .then(function (r) {
            _this.websocketService.joinGame(r._id);
            r.players.push({ player: _this.getAuthUser()._id, score: 0 });
            _this.gameService
                .update(r)
                .then(function () {
                _this.updateGamesList();
                _this.gameName = '';
                _this.websocketService.sendNotificationMessageToAll(_this.getAuthUser().username + ' created a game');
                _this.websocketService.sendNotificationMessageToUser('You created a game');
            });
        });
    };
    HomeComponent.prototype.joinGame = function (game) {
        var _this = this;
        if (game.players.length < 4) {
            this.websocketService.joinGame(game._id);
            game.players.push({ player: this.getAuthUser()._id, score: 0 });
            this.gameService
                .update(game)
                .then(function () {
                _this.updateGamesList();
                _this.websocketService.sendNotificationMessageToAll(_this.getAuthUser().username + ' joined a game');
                _this.websocketService.sendNotificationMessageToUser('You joined a game');
            });
        }
    };
    HomeComponent.prototype.leaveGame = function (game) {
        var _this = this;
        if (game.players.length > 1) {
            this.websocketService.leaveGame(game._id);
            game.players.forEach(function (item, index, object) {
                if (item.player === _this.getAuthUser()._id) {
                    object.splice(index, 1);
                }
            });
            this.gameService
                .update(game)
                .then(function () {
                _this.updateGamesList();
                _this.websocketService.sendNotificationMessageToAll(_this.getAuthUser().username + ' left a game');
                _this.websocketService.sendNotificationMessageToUser('You left a game');
            });
        }
    };
    HomeComponent.prototype.startGame = function (game) {
        var _this = this;
        game.status = 1;
        game.startDate = new Date();
        this.gameService
            .update(game)
            .then(function () {
            _this.websocketService.startGame(game);
            _this.websocketService.sendNotificationMessageToAll(_this.getAuthUser().username + ' started a game');
            _this.websocketService.sendNotificationMessageToUser('You started a game');
        });
    };
    HomeComponent.prototype.endGame = function (game) {
        var _this = this;
        this.gameService
            .deleteGame(game._id)
            .then(function () {
            _this.updateGamesList();
            _this.websocketService.sendNotificationMessageToAll(_this.getAuthUser().username + ' ended a game');
            _this.websocketService.sendNotificationMessageToUser('You ended a game');
        });
    };
    HomeComponent.prototype.filterGames = function (search, searchBy, myGames) {
        var _this = this;
        if (search == '') {
            this.getHistoryGames();
        }
        else {
            this.gameService
                .getHistoryGames()
                .then(function (r) {
                _this.historyGames = r.games;
                _this.historyUsernames = r.usernames;
                switch (searchBy) {
                    case 'gameName':
                        if (myGames) {
                            _this.historyGames = _this.historyGames.filter(function (el) {
                                return el.name.includes(search) && el.creator == _this.getAuthUser()._id;
                            });
                        }
                        else {
                            _this.historyGames = _this.historyGames.filter(function (el) {
                                return el.name.includes(search);
                            });
                        }
                        break;
                    case 'createdBy':
                        if (myGames) {
                            _this.historyGames = _this.historyGames.filter(function (el) {
                                return _this.getHistoryUsernameById(el.creator).includes(search) && el.creator == _this.getAuthUser()._id;
                            });
                        }
                        else {
                            _this.historyGames = _this.historyGames.filter(function (el) {
                                return _this.getHistoryUsernameById(el.creator).includes(search);
                            });
                        }
                        break;
                    case 'status':
                        if (myGames) {
                            _this.historyGames = _this.historyGames.filter(function (el) {
                                return el.status == +search && el.creator == _this.getAuthUser()._id;
                            });
                        }
                        else {
                            _this.historyGames = _this.historyGames.filter(function (el) {
                                return el.status == +search;
                            });
                        }
                        break;
                    case 'startDate':
                        if (myGames) {
                            _this.historyGames = _this.historyGames.filter(function (el) {
                                return _this.formatDate(el.startDate.toString()).includes(search) && el.winner == _this.getAuthUser()._id;
                            });
                        }
                        else {
                            _this.historyGames = _this.historyGames.filter(function (el) {
                                return _this.formatDate(el.startDate.toString()).includes(search);
                            });
                        }
                        break;
                    case 'endDate':
                        if (myGames) {
                            _this.historyGames = _this.historyGames.filter(function (el) {
                                return _this.formatDate(el.endDate.toString()).includes(search) && el.winner == _this.getAuthUser()._id;
                            });
                        }
                        else {
                            _this.historyGames = _this.historyGames.filter(function (el) {
                                return _this.formatDate(el.endDate.toString()).includes(search);
                            });
                        }
                        break;
                    case 'winner':
                        if (myGames) {
                            _this.historyGames = _this.historyGames.filter(function (el) {
                                return _this.getHistoryUsernameById(el.winner).includes(search) && el.winner == _this.getAuthUser()._id;
                            });
                        }
                        else {
                            _this.historyGames = _this.historyGames.filter(function (el) {
                                return _this.getHistoryUsernameById(el.winner).includes(search);
                            });
                        }
                        break;
                    case 'players':
                        if (myGames) {
                            _this.historyGames = _this.historyGames.filter(function (el) {
                                var bool = false;
                                for (var i = 0; i < el.players.length; i++) {
                                    if (_this.getHistoryUsernameById(el.players[i].player).includes(search) && el.winner == _this.getAuthUser()._id) {
                                        bool = true;
                                    }
                                }
                                return bool;
                            });
                        }
                        else {
                            _this.historyGames = _this.historyGames.filter(function (el) {
                                var bool = false;
                                for (var i = 0; i < el.players.length; i++) {
                                    if (_this.getHistoryUsernameById(el.players[i].player).includes(search)) {
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
    };
    HomeComponent.prototype.userInGame = function (game) {
        var _this = this;
        var bool = false;
        game.players.forEach(function (p) {
            if (p.player === _this.getAuthUser()._id) {
                bool = true;
            }
        });
        return bool;
    };
    HomeComponent.prototype.updateGamesList = function () {
        this.websocketService.updateGamesList();
    };
    HomeComponent.prototype.getGames = function () {
        var _this = this;
        this.gameService
            .getLobbyGames()
            .then(function (r) {
            _this.games = r.games;
            _this.usernames = r.usernames;
        });
    };
    HomeComponent.prototype.getHistoryGames = function () {
        var _this = this;
        this.gameService
            .getHistoryGames()
            .then(function (r) {
            _this.historyGames = r.games;
            _this.historyUsernames = r.usernames;
        });
    };
    HomeComponent.prototype.getTop10Victories = function () {
        var _this = this;
        this.userService
            .getTop10Victories()
            .then(function (r) { return _this.top10V = r; });
    };
    HomeComponent.prototype.getTop10V = function () {
        return this.top10V;
    };
    HomeComponent.prototype.getTop10Points = function () {
        var _this = this;
        this.userService
            .getTop10Points()
            .then(function (r) { return _this.top10P = r; });
    };
    HomeComponent.prototype.getTop10P = function () {
        return this.top10P;
    };
    HomeComponent.prototype.getUsernameById = function (id) {
        return this.usernames[id];
    };
    HomeComponent.prototype.getHistoryUsernameById = function (id) {
        return this.historyUsernames[id];
    };
    HomeComponent.prototype.hasGames = function () {
        return this.games.length > 0;
    };
    HomeComponent.prototype.sendMessage = function (value) {
        this.websocketService.sendChatMessage(value.message);
        this.message = '';
    };
    HomeComponent.prototype.goProfile = function () {
        this.router.navigate(['/profile']);
    };
    HomeComponent.prototype.goLobby = function () {
        this.router.navigate(['/home']);
    };
    HomeComponent.prototype.formatDate = function (date) {
        if (date) {
            var parts = date.split('T');
            var d = parts[0].split('-');
            var day = d[2];
            var month = d[1];
            var year = d[0];
            var time = parts[1].split(':');
            var mins = time[1];
            var hours = time[0];
            return day + "-" + month + "-" + year + " " + hours + ":" + mins;
        }
        else {
            return '';
        }
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'home.component.html',
        styleUrls: ['home.component.css']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder, forms_1.FormBuilder, router_1.Router, user_service_1.UserService,
        game_service_1.GameService, websocket_service_1.WebSocketService, core_2.CookieService])
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map