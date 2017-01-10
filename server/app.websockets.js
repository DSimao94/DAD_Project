"use strict";
const Celula_1 = require("../angular/app/model/Celula");
const Tabuleiro_1 = require("../angular/app/model/Tabuleiro");
const Navio_1 = require("../angular/app/model/Navio");
const io = require('socket.io');
class WebSocketServer {
    constructor() {
        this.board = [];
        this.games = {}; // hash que associa game ids a games a decorrer
        this.CircularJSON = require('circular-json');
        this.init = (server) => {
            this.io = io.listen(server);
            this.io.sockets.on('connection', (client) => {
                client.on('ready', (gameId, playerId, board) => {
                    let g = this.games[gameId];
                    let jsonboard = this.CircularJSON.parse(board); //board has circular references
                    g.boards[playerId] = new Tabuleiro_1.Tabuleiro();
                    // the atts and methods weren't copied because of the json so this is needed
                    g.boards[playerId].celulas = jsonboard.celulas;
                    g.boards[playerId].posicoesOcupadas = jsonboard.posicoes;
                    g.boards[playerId].navios = jsonboard.navios;
                    g.playersReady++;
                    let i = 0;
                    let posicoesDosElementosComNavio = [];
                    if (g.playersReady == g.players.length) {
                        g.nextPlayer = g.creator;
                        /*console.log("enviar o board do player: "+ playerId);
                        g.boards[playerId].navios.forEach((n) => {
                            n.celulas.forEach((c) => {
                                if (c.pertenceA) {
                                    //posicoesDosElementosComNavio[i++];
                                }
                            })
                        });*/
                        //console.log("posicoes ocupadas: ");
                        //console.log(g.boards[playerId].posicoesOcupadas);
                        //boardInimigo = g.boards[playerId].posicoesOcupadas;//this.CircularJSON.stringify(g.boards[playerId]);
                        this.io.to(g._id).emit('ready', g.nextPlayer);
                    }
                });
                // on click botao
                client.emit('game-chat', ['System notify', 'Welcome to battleship']);
                //msg para todos
                client.on('chatAll', (data) => this.io.emit('game-chat', data));
                //msg para o user
                client.on('chatUser', (data) => client.emit('game-chat', data));
                //msg para todos menos o user
                client.on('chatOthers', (data) => client.broadcast.emit('game-chat', data));
                //msg para game room
                client.on('chatGame', (data) => this.io.to(data[2]).emit('chatGame', data));
                //board e game
                client.on('clickElement', (data) => {
                    // data 0 = game id, data 1 = player, 2 = index, 3 = playsAvailable, 4 = attackerPlayer, 5 = virar
                    let line = Math.floor((data[2] / 10));
                    let column = (data[2] % 10) + 1;
                    let b = this.games[data[0]].boards[data[1]];
                    let celula = b.getCelula(String.fromCharCode(65 + line), +column);
                    let tiro;
                    let navio = null;
                    celula.tiro = true;
                    if (celula.tipo == Celula_1.TipoCelula.Mar) {
                        tiro = 1;
                    }
                    else if (celula.tipo == Celula_1.TipoCelula.Navio) {
                        tiro = 2;
                        let score;
                        switch (celula.pertenceA.tipoNavio) {
                            case Navio_1.TipoNavio.PortaAvioes:
                                score = 20;
                                navio = Navio_1.TipoNavio.PortaAvioes;
                                break;
                            case Navio_1.TipoNavio.Couracado:
                                score = 15;
                                navio = Navio_1.TipoNavio.Couracado;
                                break;
                            case Navio_1.TipoNavio.Cruzador:
                                score = 10;
                                navio = Navio_1.TipoNavio.Cruzador;
                                break;
                            case Navio_1.TipoNavio.ContraTorpedeiro:
                                score = 5;
                                navio = Navio_1.TipoNavio.ContraTorpedeiro;
                                break;
                            case Navio_1.TipoNavio.Submarino:
                                score = 3;
                                navio = Navio_1.TipoNavio.Submarino;
                                break;
                        }
                        let sank = true;
                        celula.pertenceA.celulas.forEach((celula) => {
                            if (!celula.tiro)
                                sank = false;
                        });
                        if (!sank)
                            score = 1;
                        this.incrementScore(data[0], data[4], score);
                    }
                    if (data[3] == 0) {
                        this.setNextPlayer(data[0]);
                    }
                    let winner = this.isGameOver(data[0]);
                    if (winner) {
                        this.incrementScore(data[0], data[4], 50);
                    }
                    console.log('valor');
                    console.log(data[5]);
                    let virar = false;
                    if (data[5]) {
                        console.log('entrou');
                        virar = true;
                    }
                    this.io.to(data[0]).emit('board', [data[1], data[2], tiro, this.CircularJSON.stringify(this.games[data[0]]), navio, winner, virar]);
                    if (winner) {
                        delete this.games[data[0]];
                    }
                });
                client.emit('board', this.board);
                client.on('joinGame', (id) => {
                    client.join(id);
                });
                client.on('leaveGame', (id) => {
                    client.leave(id);
                });
                client.on('deleteGame', (id) => {
                    this.io.delete(id);
                });
                client.on('startGame', (game) => {
                    this.io.to(game._id).emit('startGame', game._id);
                    this.games[game._id] = game;
                    this.games[game._id].playersReady = 0;
                });
                client.on('updateGamesList', () => this.io.emit('updateGamesList'));
            });
        };
        this.incrementScore = (gameId, playerId, score) => {
            this.games[gameId].players.forEach((player) => {
                if (player.player == playerId) {
                    player.score += score;
                }
            });
        };
        this.setNextPlayer = (gameId) => {
            let g = this.games[gameId];
            let l = g.players.length;
            for (let i = 0; i < l; i++) {
                if (g.players[i].player == g.nextPlayer) {
                    this.games[gameId].nextPlayer = g.players[i + 1 == l ? 0 : i + 1].player;
                    break;
                }
            }
        };
        this.notifyAll = (channel, message) => {
            this.io.emit(channel, message);
        };
    }
    isGameOver(gameId) {
        let numberOfFinishedBoards = 0;
        let winner = '';
        this.games[gameId].players.forEach((p) => {
            let boardFinished = true;
            let board = this.games[gameId].boards[p.player];
            board.navios.forEach((n) => {
                n.celulas.forEach((c) => {
                    if (!c.tiro) {
                        boardFinished = false;
                    }
                });
            });
            if (boardFinished)
                numberOfFinishedBoards++;
            else
                winner = p.player;
        });
        if (numberOfFinishedBoards == this.games[gameId].players.length - 1)
            return winner;
        return null;
    }
}
exports.WebSocketServer = WebSocketServer;
