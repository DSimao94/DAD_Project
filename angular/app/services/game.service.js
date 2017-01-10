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
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var BASE_URL = 'http://localhost:8080/api/v1/';
var GameService = (function () {
    function GameService(http) {
        this.http = http;
    }
    GameService.prototype.get = function (gameId) {
        var _this = this;
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        var url = BASE_URL + 'games/' + gameId;
        return this.http
            .get(url, { headers: headers })
            .toPromise()
            .then(function (r) { return _this.handleResponse(r.json()); })
            .catch(function (r) { return _this.handleError(); });
    };
    GameService.prototype.create = function (game) {
        var _this = this;
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        delete game._id;
        var url = BASE_URL + "games";
        return this.http
            .post(url, JSON.stringify(game), { headers: headers })
            .toPromise()
            .then(function (r) { return _this.handleResponse(r.json()); })
            .catch(function (r) { return _this.handleError(); });
    };
    GameService.prototype.update = function (game) {
        var _this = this;
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        var url = BASE_URL + "games/" + game._id;
        return this.http
            .put(url, JSON.stringify(game), { headers: headers })
            .toPromise()
            .then(function (r) { return _this.handleResponse(r.json()); })
            .catch(function (r) { return _this.handleError(); });
    };
    GameService.prototype.deleteGame = function (game_id) {
        var _this = this;
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        var url = BASE_URL + "games/" + game_id;
        return this.http
            .delete(url, { headers: headers })
            .toPromise()
            .then(function (r) { return _this.handleResponse(r.json()); })
            .catch(function (r) { return _this.handleError(); });
    };
    GameService.prototype.getLobbyGames = function () {
        var _this = this;
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        var lobbyGames = BASE_URL + "games";
        return this.http
            .get(lobbyGames, { headers: headers })
            .toPromise()
            .then(function (r) { return _this.handleResponse(r.json()); })
            .catch(function (r) { return _this.handleError(); });
    };
    GameService.prototype.getHistoryGames = function () {
        var _this = this;
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        var historyGames = BASE_URL + "games-history";
        return this.http
            .get(historyGames, { headers: headers })
            .toPromise()
            .then(function (r) { return _this.handleResponse(r.json()); })
            .catch(function (r) { return _this.handleError(); });
    };
    GameService.prototype.handleResponse = function (data) {
        return Promise.resolve(data);
    };
    GameService.prototype.handleError = function () {
        return Promise.resolve({ Error: true, message: 'internal error' });
    };
    return GameService;
}());
GameService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map