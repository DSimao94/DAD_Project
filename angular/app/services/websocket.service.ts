import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';

import * as io from 'socket.io-client';
import {Game} from "../model/Game";
import {Tabuleiro} from "../model/Tabuleiro";

@Injectable()
export class WebSocketService {
    private socket: SocketIOClient.Socket;

    constructor() {
        if (!this.socket) {
            this.socket = io(`http://localhost:8080`);
            //this.socket = io(`http://${window.location.hostname}:${window.location.port}`);
        }
    }

    sendChatMessage(message: any) {
        console.log(this.socket);
        this.socket.emit('chatAll', [JSON.parse(localStorage.getItem('user')).username, message]);
    }

    sendGameChatMessage(message: any, gameId: string) {
        console.log(this.socket);
        this.socket.emit('chatGame', [JSON.parse(localStorage.getItem('user')).username, message, gameId]);
    }

    sendNotificationMessageToUser(message: any) {
        this.socket.emit('chatUser', ['System notify', message]);
    }

    sendNotificationMessageToAll(message: any) {
        this.socket.emit('chatOthers', ['System notify', message]);
    }

    joinGame(idGame: string) {
        this.socket.emit('joinGame', idGame);
    }

    leaveGame(idGame: string) {
        this.socket.emit('leaveGame', idGame);
    }

    deleteGame(idGame: string) {
        this.socket.emit('deleteGame', idGame);
    }

    startGame(game: Game) {
        this.socket.emit('startGame', game);
    }

    sendReadyMessage(gameId: string, playerId: string, board: string) {
        this.socket.emit('ready', gameId, playerId, board);
    }

    updateGamesList() {
        this.socket.emit('updateGamesList');
    }

    getUpdatedList(): Observable<any> {
        return this.listenOnChannel('updateGamesList');
    }

    getReady(): Observable<any> {
        return this.listenOnChannel('ready');
    }

    getStartGame(): Observable<any> {
        return this.listenOnChannel('startGame');
    }

    getPlayersMessages(): Observable<any> {
        return this.listenOnChannel('players');
    }

    getChatMessages(): Observable<any> {
        return this.listenOnChannel('game-chat');
    }

    getGameChatMessages(): Observable<any> {
        return this.listenOnChannel('chatGame');
    }

    // Extra Exercise
    sendClickElementMessage(gameId: string, playerId: string, index: number, plays: number, attackerId: string, virar: boolean) {
        console.log(this.socket);
        this.socket.emit('clickElement', [gameId, playerId, index, plays, attackerId, virar]);
    }

    getBoardMessage(): Observable<any> {
        return this.listenOnChannel('board');
    }


    private listenOnChannel(channel: string): Observable<any> {
        return new Observable((observer: any) => {
            this.socket.on(channel, (data: any) => {
                observer.next(data);
            });
            return () => this.socket.disconnect();
        });
    }

    private handleResponse(data: any): Promise<any> {
        return Promise.resolve(data);
    }

    private handleError(): Promise<any> {
        return Promise.resolve({Error: true, message: 'internal error'});
    }
}
