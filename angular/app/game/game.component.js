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
var core_1 = require('@angular/core');
var websocket_service_1 = require("../services/websocket.service");
var router_1 = require("@angular/router");
var game_service_1 = require("../services/game.service");
var Tabuleiro_1 = require("../model/Tabuleiro");
var Celula_1 = require("../model/Celula");
var Posicao_1 = require("../model/Posicao");
var Navio_1 = require("../model/Navio");
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var user_service_1 = require("../services/user.service");
var GameComponent = (function () {
    function GameComponent(websocketService, route, router, gameService, userService) {
        this.websocketService = websocketService;
        this.route = route;
        this.router = router;
        this.gameService = gameService;
        this.userService = userService;
        this.game = null;
        this.virar = false;
        this.tabuleiro = new Tabuleiro_1.Tabuleiro();
        this.ships = {
            carriers: { max: 1, set: 0 },
            battleships: { max: 1, set: 0 },
            cruisers: { max: 2, set: 0 },
            destroyers: { max: 3, set: 0 },
            submarines: { max: 4, set: 0 } // submarinos
        };
        this.CircularJSON = require('circular-json');
        this.elementos = {};
        this.playing = false;
        this.playsAvailable = 0;
        this.myScore = 0;
        this.enemyBoardsVisibility = 'hidden';
        this.notificationsVisibility = 'hidden';
        this.shipSettingsDisplay = '';
        this.shipListTitle = 'Ship list: ';
        this.notificationsList = [];
        this.shipListDisplay = '';
        this.modalText = '';
    }
    GameComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            var gameId = params['id'];
            _this.gameService
                .get(gameId)
                .then(function (r) {
                _this.game = r;
                console.log("Subscribed game.");
                setTimeout(function () {
                    _this.clearBoard();
                    _this.initBoards();
                }, 700);
            });
        });
        this.websocketService.getReady().subscribe(function (m) {
            _this.shipSettingsDisplay = 'none';
            _this.shipListTitle = 'Notifications';
            _this.title = 'Game ' + _this.game.name + ' has started!';
            _this.enemyBoardsVisibility = 'visible';
            _this.notificationsVisibility = 'visible';
            _this.shipListDisplay = 'none';
            _this.checkUser(m);
            if (_this.playing || _this.playsAvailable > 0) {
                _this.notificationsList.push('Your turn to play. Shots available: ' + _this.playsAvailable);
            }
            else {
                _this.notificationsList.push('Waiting for your turn to play...');
            }
        });
        this.websocketService.getBoardMessage().subscribe(function (m) {
            //  m[0] = player ID, m[1] = index, m[2] = mar(1)/tiro(2), m[3] = game, m[4] = navio acertado, m[5] = gameFinished, m[6] = navio afundado, m[7] = virar
            _this.game = _this.CircularJSON.parse(m[3]);
            console.log('aqui0');
            console.log(m[7]);
            console.log(m);
            if (m[6]) {
                console.log('aqui1');
                var playersInimigos_1 = [];
                _this.game.players.forEach(function (p) {
                    if (p.player != _this.getUser()._id) {
                        playersInimigos_1.push(p.player);
                    }
                });
                playersInimigos_1.forEach(function (p) {
                    _this.game.boards[p].celulas.forEach(function (c) {
                        if (c.pertenceA) {
                            //meter a cor este elemento
                            var coluna = c.posicao.coluna;
                            var linha = c.posicao.linha;
                            var linhaNr = linha.charCodeAt(0) - 65;
                            var novoIndex_1 = (linhaNr * 10) + coluna;
                            console.log(novoIndex_1);
                            console.log(_this.elementos[p]);
                            _this.elementos[p][novoIndex_1 - 1] = 2;
                            setTimeout(function () {
                                _this.elementos[p][novoIndex_1 - 1] = 0;
                            }, 2000);
                        }
                    });
                });
            }
            _this.game.players.forEach(function (p) {
                if (p.player == _this.getUser()._id)
                    _this.myScore = p.score;
            });
            if (m[0] == _this.getUser()._id) {
                /*if (m[6]) {
                 console.log('aqui');
                 let line = Math.floor((m[1] / 10));
                 let column = (m[1] % 10) + 1;

                 let jsonboard = this.game.boards[m[0]];
                 let b = this.game.boards[m[0]] = new Tabuleiro();
                 this.game.boards[m[0]].celulas = jsonboard.celulas;
                 this.game.boards[m[0]].posicoesOcupadas = jsonboard.posicoes;
                 this.game.boards[m[0]].navios = jsonboard.navios;

                 let celula = b.getCelula(String.fromCharCode(65 + line), +column);
                 let tds = document.getElementsByTagName('td');
                 celula.pertenceA.celulas.forEach((c: any) => {
                 let coluna = c.posicao.coluna;
                 let linha = c.posicao.linha;
                 let linhaNr = linha.charCodeAt(0) - 65;

                 let novoIndex = (coluna * 10) + linhaNr;

                 let indexIncrement = Math.floor(novoIndex / 10) + 1;
                 tds[novoIndex + indexIncrement].style.backgroundColor = 'black';
                 })
                 }*/
                var tds = document.getElementsByTagName('td');
                var indexIncrement = Math.floor(m[1] / 10) + 1; // because the table has letters and numbers
                tds[m[1] + indexIncrement].style.backgroundColor = m[2] == 1 ? 'blue' : 'red';
            }
            else {
                console.log("chegou");
                var i = void 0;
                for (i = 0; i < _this.elementos[m[0]].length; i++) {
                    if (_this.elementos[m[0]][m[4]])
                        _this.elementos[m[0][i]] = 1;
                }
                _this.elementos[m[0]][m[1]] = m[2];
            }
            var g = _this.CircularJSON.parse(m[3]);
            //if game is finished...
            if (m[5]) {
                _this.winner = m[5];
                _this.setTextOnModal();
                _this.modal.open();
            }
            _this.checkUser(g.nextPlayer);
            _this.updateNotificationsList(m[1], m[4]);
        });
    };
    GameComponent.prototype.virarNavios = function () {
        this.virar = true;
        console.log('aqui4');
        console.log(this.virar);
        this.websocketService.sendClickElementMessage(this.game._id, this.game.players[0].player, 0, --this.playsAvailable, this.getUser()._id, this.virar);
    };
    GameComponent.prototype.setTextOnModal = function () {
        var _this = this;
        var winnerScore = 0;
        this.game.players.forEach(function (p) {
            if (p.player == _this.winner)
                winnerScore = p.score;
        });
        if (this.winner == this.getUser()._id) {
            this.modalText = 'Congratulations! You won with ' + winnerScore + ' points!';
        }
        else {
            this.modalText = 'Player ' + this.winner + ' won with ' + winnerScore + ' points!\nYour score: ' + this.myScore + '\n Better luck next time.'; // falta mostrar o nome do winner
        }
    };
    GameComponent.prototype.closeGame = function () {
        var _this = this;
        delete this.game.nextPlayer; // this is added on the server
        delete this.game.boards;
        this.game.status = 2;
        this.game.winner = this.winner;
        this.game.endDate = new Date();
        this.gameService.update(this.game);
        this.game.players.forEach(function (p) {
            _this.userService
                .get(p.player, _this.getUser().token)
                .then(function (r) {
                r.totalPoints += p.score;
                if (p.player == _this.winner)
                    r.totalVictories++;
                _this.userService
                    .update(r);
            });
        });
        this.modal
            .close()
            .then(function () {
            _this.router.navigate(['/home']);
        });
    };
    GameComponent.prototype.checkUser = function (m) {
        if (this.getUser()._id == m && !this.playing) {
            this.playsAvailable = this.getMaxPlaysAvailable();
            this.playing = true;
        }
    };
    GameComponent.prototype.updateNotificationsList = function (index, ship) {
        var position = '';
        var shipShotName = '';
        if (index) {
            console.log("Cell pressed index: " + index);
            position = this.getCelulaByIndex(index).posicao.linha + this.getCelulaByIndex(index).posicao.coluna;
        }
        switch (ship) {
            case Navio_1.TipoNavio.PortaAvioes:
                shipShotName = 'Carrier';
                break;
            case Navio_1.TipoNavio.Couracado:
                shipShotName = 'Battleship';
                break;
            case Navio_1.TipoNavio.Cruzador:
                shipShotName = 'Cruiser';
                break;
            case Navio_1.TipoNavio.ContraTorpedeiro:
                shipShotName = 'Destroyer';
                break;
            case Navio_1.TipoNavio.Submarino:
                shipShotName = 'Submarine';
                break;
        }
        this.notificationsList = [];
        if (this.playing || this.playsAvailable > 0) {
            this.notificationsList.push('Your turn to play. Shots available: ' + this.playsAvailable);
            if (this.playsAvailable < this.getMaxPlaysAvailable()) {
                var shipType = this.getCelulaByIndex(index).tipo;
                if (shipType == Celula_1.TipoCelula.Navio) {
                    this.notificationsList.push('You shot a ' + shipShotName + ' on position ' + position + '!');
                }
                else {
                    this.notificationsList.push('You missed on position ' + position + '!');
                }
            }
            else if (position && this.playsAvailable < this.getMaxPlaysAvailable()) {
                this.notificationsList.push('You missed on position ' + position + '!');
            }
        }
        else {
            this.notificationsList.push('Waiting for your turn to play...');
        }
    };
    GameComponent.prototype.getCelulaByIndex = function (index) {
        var line = Math.floor((index / 10));
        var column = (index % 10) + 1;
        return this.tabuleiro.getCelula(String.fromCharCode(65 + line), +column);
    };
    GameComponent.prototype.getMaxPlaysAvailable = function () {
        return (this.game.players.length - 1) * 2;
    };
    GameComponent.prototype.initBoards = function () {
        var _this = this;
        var players = [];
        this.game.players.forEach(function (p) {
            if (p.player != _this.getUser()._id) {
                players.push(p.player);
            }
        });
        players.forEach(function (p) {
            _this.elementos[p] = [];
            for (var i = 0; i < 100; i++) {
                _this.elementos[p][i] = 0;
            }
        });
    };
    GameComponent.prototype.getUser = function () {
        return JSON.parse(localStorage.getItem('user'));
    };
    GameComponent.prototype.clickElemento = function (index, event) {
        var target = event.target || event.srcElement || event.currentTarget;
        var boardId = target.attributes.id.nodeValue;
        if (this.playsAvailable > 0 && target.style.backgroundColor == 'lightgray') {
            this.websocketService.sendClickElementMessage(this.game._id, boardId, index, --this.playsAvailable, this.getUser()._id, this.virar);
            if (this.playsAvailable == 0)
                this.playing = false;
            this.updateNotificationsList(index, '');
        }
    };
    GameComponent.prototype.getColor = function (elemento) {
        switch (elemento) {
            case 0:
                return 'lightgray';
            case 1:
                return 'blue';
            case 2:
                return 'red';
        }
        return 'white';
    };
    GameComponent.prototype.clearBoard = function () {
        document.getElementById('msgerro').innerText = '';
        this.ships.carriers.set = 0;
        this.ships.battleships.set = 0;
        this.ships.cruisers.set = 0;
        this.ships.destroyers.set = 0;
        this.ships.submarines.set = 0;
        this.tabuleiro = new Tabuleiro_1.Tabuleiro();
        this.drawBoard();
    };
    GameComponent.prototype.verifyIfAllShips = function () {
        var _this = this;
        var allShipsPlaced = true;
        this.tabuleiro.navios.forEach(function (navio) {
            switch (navio.tipoNavio) {
                case 0:
                    if (_this.ships.carriers.set != _this.ships.carriers.max) {
                        allShipsPlaced = false;
                    }
                    break;
                case 1:
                    if (_this.ships.battleships.set != _this.ships.battleships.max) {
                        allShipsPlaced = false;
                    }
                    break;
                case 2:
                    if (_this.ships.cruisers.set != _this.ships.cruisers.max) {
                        allShipsPlaced = false;
                    }
                    break;
                case 3:
                    if (_this.ships.destroyers.set != _this.ships.destroyers.max) {
                        allShipsPlaced = false;
                    }
                    break;
                case 4:
                    if (_this.ships.submarines.set != _this.ships.submarines.max) {
                        allShipsPlaced = false;
                    }
                    break;
            }
        });
        if (this.tabuleiro.navios.length < 10) {
            allShipsPlaced = false;
        }
        return allShipsPlaced;
    };
    GameComponent.prototype.ready = function () {
        this.websocketService.sendReadyMessage(this.game._id, this.getUser()._id, this.CircularJSON.stringify(this.tabuleiro));
    };
    GameComponent.prototype.preSetShips = function () {
        var tipo = document.getElementById('shiptype');
        var linha = document.getElementById('line');
        var coluna = document.getElementById('column');
        tipo.value = 0;
        linha.value = 'A';
        coluna.value = 1;
        this.addShip(); // Carrier
        tipo.value = 1;
        coluna.value = 5;
        this.addShip(); // Battleship
        tipo.value = 2;
        linha.value = 'C';
        coluna.value = 4;
        this.addShip(); // Cruiser 1
        coluna.value = 8;
        this.addShip(); // Cruiser 2
        tipo.value = 3;
        linha.value = 'E';
        coluna.value = 1;
        this.addShip(); // Destroyer 1
        coluna.value = 4;
        this.addShip(); // Destroyer 2
        coluna.value = 7;
        this.addShip(); // Destroyer 3
        tipo.value = 4;
        linha.value = 'G';
        for (var s = 1; s < 8; s += 2) {
            coluna.value = s;
            this.addShip(); // Submarine 1, 2, 3 and 4
        }
    };
    GameComponent.prototype.drawBoard = function () {
        var _this = this;
        document.getElementById('msgerro').innerText = '';
        try {
            document.getElementById('tabela').innerHTML = "";
            var plainHtml_1 = "";
            Tabuleiro_1.Tabuleiro.todasLinhas().forEach(function (linha) {
                plainHtml_1 += "<tr><td>" + linha + "</td>";
                Tabuleiro_1.Tabuleiro.todasColunas().forEach(function (coluna) {
                    if (_this.tabuleiro.getCelula(linha, coluna).tipo == Celula_1.TipoCelula.Navio)
                        plainHtml_1 += "<td>X</td>";
                    else if (Posicao_1.Posicao.existe(new Posicao_1.Posicao(linha, coluna), _this.tabuleiro.posicoesOcupadas))
                        plainHtml_1 += "<td>.</td>";
                    else
                        plainHtml_1 += "<td>&nbsp</td>";
                });
                plainHtml_1 += "</tr>";
            });
            plainHtml_1 += "<tr><td></td>";
            Tabuleiro_1.Tabuleiro.todasColunas().forEach(function (coluna) {
                plainHtml_1 += "<td>" + coluna + "</td>";
            });
            plainHtml_1 += "</tr>";
            document.getElementById('tabela').innerHTML = plainHtml_1;
            var tds = document.getElementsByTagName('td');
            for (var i = 0; i < tds.length; i++) {
                tds[i].style.border = '2px solid #FFF';
                tds[i].style.backgroundColor = 'lightgray';
                tds[i].style.width = '100px !important';
                tds[i].style.minWidth = '100px !important';
                tds[i].style.height = '100px !important';
            }
            plainHtml_1 = "";
            document.getElementById('listanavios').innerHTML = "";
            this.tabuleiro.navios.forEach(function (navio) {
                plainHtml_1 += "<li>" + navio.posicao.strValue() + " Tipo=" + navio.tipoNavio + ", Orientação=" + navio.orientacao + "</li>";
            });
            document.getElementById('listanavios').innerHTML = plainHtml_1;
        }
        catch (e) {
            document.getElementById('msgerro').innerText = e;
        }
    };
    GameComponent.prototype.addShip = function () {
        document.getElementById('msgerro').innerText = '';
        try {
            var tipo = document.getElementById('shiptype').value;
            var orient = document.getElementById('orientation').value;
            var linha = document.getElementById('line').value;
            if (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].indexOf(linha) < 0) {
                throw Error("Line value is invalid");
            }
            var coluna = document.getElementById('column').value;
            var tipoNavio = Navio_1.TipoNavio.PortaAvioes;
            switch (tipo) {
                case "0":
                    if (this.ships.carriers.set + 1 > 1)
                        throw Error("Maximum number of carriers is 1");
                    break;
                case "1":
                    tipoNavio = Navio_1.TipoNavio.Couracado;
                    if (this.ships.battleships.set + 1 > 1)
                        throw Error("Maximum number of battleships is 1");
                    break;
                case "2":
                    tipoNavio = Navio_1.TipoNavio.Cruzador;
                    if (this.ships.cruisers.set + 1 > 2)
                        throw Error("Maximum number of cruisers is 2");
                    break;
                case "3":
                    tipoNavio = Navio_1.TipoNavio.ContraTorpedeiro;
                    if (this.ships.destroyers.set + 1 > 3)
                        throw Error("Maximum number of destroyers is 3");
                    break;
                case "4":
                    tipoNavio = Navio_1.TipoNavio.Submarino;
                    if (this.ships.submarines.set + 1 > 4)
                        throw Error("Maximum number of submarines is 4");
                    break;
            }
            var orientacao = Navio_1.Orientacao.Normal;
            switch (orient) {
                case "1":
                    orientacao = Navio_1.Orientacao.Roda90;
                    break;
                case "2":
                    orientacao = Navio_1.Orientacao.Roda180;
                    break;
                case "3":
                    orientacao = Navio_1.Orientacao.Roda270;
                    break;
            }
            // Força cast para numero
            var col = +coluna;
            this.tabuleiro.adicionaNavio(tipoNavio, orientacao, linha, col);
            switch (tipoNavio) {
                case Navio_1.TipoNavio.PortaAvioes:
                    this.ships.carriers.set++;
                    break;
                case Navio_1.TipoNavio.Couracado:
                    this.ships.battleships.set++;
                    break;
                case Navio_1.TipoNavio.Cruzador:
                    this.ships.cruisers.set++;
                    break;
                case Navio_1.TipoNavio.ContraTorpedeiro:
                    this.ships.destroyers.set++;
                    break;
                case Navio_1.TipoNavio.Submarino:
                    this.ships.submarines.set++;
                    break;
            }
            this.drawBoard();
            this.verifyIfAllShips();
        }
        catch (e) {
            document.getElementById('msgerro').innerText = e;
        }
    };
    __decorate([
        core_1.ViewChild('modal'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], GameComponent.prototype, "modal", void 0);
    GameComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'game.component.html',
            styleUrls: ['game.component.css']
        }), 
        __metadata('design:paramtypes', [websocket_service_1.WebSocketService, router_1.ActivatedRoute, router_1.Router, game_service_1.GameService, user_service_1.UserService])
    ], GameComponent);
    return GameComponent;
}());
exports.GameComponent = GameComponent;
//# sourceMappingURL=game.component.js.map