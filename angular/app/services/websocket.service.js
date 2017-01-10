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
var Observable_1 = require("rxjs/Observable");
var io = require("socket.io-client");
var WebSocketService = (function () {
    function WebSocketService() {
        if (!this.socket) {
            this.socket = io("http://localhost:8080");
        }
    }
    WebSocketService.prototype.sendChatMessage = function (message) {
        console.log(this.socket);
        this.socket.emit('chatAll', [JSON.parse(localStorage.getItem('user')).username, message]);
    };
    WebSocketService.prototype.sendGameChatMessage = function (message, gameId) {
        console.log(this.socket);
        this.socket.emit('chatGame', [JSON.parse(localStorage.getItem('user')).username, message, gameId]);
    };
    WebSocketService.prototype.sendNotificationMessageToUser = function (message) {
        this.socket.emit('chatUser', ['System notify', message]);
    };
    WebSocketService.prototype.sendNotificationMessageToAll = function (message) {
        this.socket.emit('chatOthers', ['System notify', message]);
    };
    WebSocketService.prototype.joinGame = function (idGame) {
        this.socket.emit('joinGame', idGame);
    };
    WebSocketService.prototype.leaveGame = function (idGame) {
        this.socket.emit('leaveGame', idGame);
    };
    WebSocketService.prototype.deleteGame = function (idGame) {
        this.socket.emit('deleteGame', idGame);
    };
    WebSocketService.prototype.startGame = function (game) {
        this.socket.emit('startGame', game);
    };
    WebSocketService.prototype.sendReadyMessage = function (gameId, playerId, board) {
        this.socket.emit('ready', gameId, playerId, board);
    };
    WebSocketService.prototype.updateGamesList = function () {
        this.socket.emit('updateGamesList');
    };
    WebSocketService.prototype.getUpdatedList = function () {
        return this.listenOnChannel('updateGamesList');
    };
    WebSocketService.prototype.getReady = function () {
        return this.listenOnChannel('ready');
    };
    WebSocketService.prototype.getStartGame = function () {
        return this.listenOnChannel('startGame');
    };
    WebSocketService.prototype.getPlayersMessages = function () {
        return this.listenOnChannel('players');
    };
    WebSocketService.prototype.getChatMessages = function () {
        return this.listenOnChannel('game-chat');
    };
    WebSocketService.prototype.getGameChatMessages = function () {
        return this.listenOnChannel('chatGame');
    };
    // Extra Exercise
    WebSocketService.prototype.sendClickElementMessage = function (gameId, playerId, index, plays, attackerId, virar) {
        console.log(this.socket);
        this.socket.emit('clickElement', [gameId, playerId, index, plays, attackerId, virar]);
    };
    WebSocketService.prototype.getBoardMessage = function () {
        return this.listenOnChannel('board');
    };
    WebSocketService.prototype.listenOnChannel = function (channel) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.on(channel, function (data) {
                observer.next(data);
            });
            return function () { return _this.socket.disconnect(); };
        });
    };
    WebSocketService.prototype.handleResponse = function (data) {
        return Promise.resolve(data);
    };
    WebSocketService.prototype.handleError = function () {
        return Promise.resolve({ Error: true, message: 'internal error' });
    };
    return WebSocketService;
}());
WebSocketService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], WebSocketService);
exports.WebSocketService = WebSocketService;
//# sourceMappingURL=websocket.service.js.map