import {Component, OnInit, ViewChild} from '@angular/core';
import {WebSocketService} from "../services/websocket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GameService} from "../services/game.service";
import {Game} from "../model/Game";
import {Tabuleiro} from "../model/Tabuleiro";
import {TipoCelula} from "../model/Celula";
import {Posicao} from "../model/Posicao";
import {TipoNavio, Orientacao} from "../model/Navio";
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {UserService} from "../services/user.service";

@Component({
    moduleId: module.id,
    templateUrl: 'game.component.html',
    styleUrls: ['game.component.css']
})

export class GameComponent implements OnInit {
    @ViewChild('modal')
    modal: ModalComponent;
    game: Game = null;
    winner: string;
    virar = false;
    message: string;
    shipSettingsDisplay: string;
    shipListTitle: string;
    title: string;
    playing: boolean;
    enemyBoardsVisibility: string;
    notificationsVisibility: string;
    notificationsList: string[];
    shipListDisplay: string;
    myScore: number;
    modalText: string;
    tabuleiro: Tabuleiro = new Tabuleiro();
    ships = {                           // navios atualmente colocados no tabuleiro
        carriers: {max: 1, set: 0},     // porta-aviões
        battleships: {max: 1, set: 0},  // couraçado
        cruisers: {max: 2, set: 0},     // cruzadores
        destroyers: {max: 3, set: 0},   // contratorpedeiros
        submarines: {max: 4, set: 0}    // submarinos
    };
    CircularJSON = require('circular-json');

    elementos: {} = {};
    playsAvailable: number;

    constructor(private websocketService: WebSocketService, private route: ActivatedRoute, private router: Router, private gameService: GameService, private userService: UserService) {
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

    ngOnInit() {
        this.route.params.subscribe(params => {
            let gameId = params['id'];
            this.gameService
                .get(gameId)
                .then(r => {
                    this.game = r;
                    console.log("Subscribed game.");
                    setTimeout(() => {
                        this.clearBoard();
                        this.initBoards();
                    }, 700);
                });
        });

        this.websocketService.getReady().subscribe((m: any) => {
            this.shipSettingsDisplay = 'none';
            this.shipListTitle = 'Notifications';
            this.title = 'Game ' + this.game.name + ' has started!';
            this.enemyBoardsVisibility = 'visible';
            this.notificationsVisibility = 'visible';
            this.shipListDisplay = 'none';
            this.checkUser(m);
            if (this.playing || this.playsAvailable > 0) {
                this.notificationsList.push('Your turn to play. Shots available: ' + this.playsAvailable);
            } else {
                this.notificationsList.push('Waiting for your turn to play...');
            }
        });

        this.websocketService.getBoardMessage().subscribe((m: any) => {

            //  m[0] = player ID, m[1] = index, m[2] = mar(1)/tiro(2), m[3] = game, m[4] = navio acertado, m[5] = gameFinished, m[6] = navio afundado, m[7] = virar
            this.game = this.CircularJSON.parse(m[3]);
            console.log('aqui0');
            console.log(m[7]);
            console.log(m);
            if (m[6]) {
                console.log('aqui1');
                let playersInimigos: any[] = [];
                this.game.players.forEach((p) => {
                    if (p.player != this.getUser()._id) {
                        playersInimigos.push(p.player);
                    }
                });
                playersInimigos.forEach((p) => {
                    this.game.boards[p].celulas.forEach((c: any) => {
                        if (c.pertenceA) {
                            //meter a cor este elemento
                            let coluna = c.posicao.coluna;
                            let linha = c.posicao.linha;
                            let linhaNr = linha.charCodeAt(0) - 65;

                            let novoIndex = (linhaNr * 10) + coluna;
                            console.log(novoIndex);
                            console.log(this.elementos[p]);
                            this.elementos[p][novoIndex -1] = 2;
                            setTimeout(()=>{
                                this.elementos[p][novoIndex -1] = 0;
                            }, 2000)
                        }
                    });
                });
            }


            this.game.players.forEach((p) => {
                if (p.player == this.getUser()._id) this.myScore = p.score;
            });
            if (m[0] == this.getUser()._id) {

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
                let tds = document.getElementsByTagName('td');

                let indexIncrement = Math.floor(m[1] / 10) + 1; // because the table has letters and numbers
                tds[m[1] + indexIncrement].style.backgroundColor = m[2] == 1 ? 'blue' : 'red';
            } else {
                console.log("chegou");
                let i: any;
                for (i = 0; i < this.elementos[m[0]].length; i++) {
                    if (this.elementos[m[0]][m[4]])
                        this.elementos[m[0][i]] = 1;
                }
                this.elementos[m[0]][m[1]] = m[2];
            }
            let g = this.CircularJSON.parse(m[3]);

            //if game is finished...
            if (m[5]) {
                this.winner = m[5];
                this.setTextOnModal();
                this.modal.open();
            }

            this.checkUser(g.nextPlayer);
            this.updateNotificationsList(m[1], m[4]);
        });
    }

    virarNavios() {
        this.virar = true;
        console.log('aqui4');
        console.log(this.virar);
        this.websocketService.sendClickElementMessage(this.game._id, this.game.players[0].player, 0, --this.playsAvailable, this.getUser()._id, this.virar);
    }

    setTextOnModal() {
        let winnerScore = 0;
        this.game.players.forEach((p) => {
            if (p.player == this.winner) winnerScore = p.score;
        });
        if (this.winner == this.getUser()._id) {
            this.modalText = 'Congratulations! You won with ' + winnerScore + ' points!';
        } else {
            this.modalText = 'Player ' + this.winner + ' won with ' + winnerScore + ' points!\nYour score: ' + this.myScore + '\n Better luck next time.';   // falta mostrar o nome do winner
        }
    }

    closeGame() {
        delete this.game.nextPlayer; // this is added on the server
        delete this.game.boards;
        this.game.status = 2;
        this.game.winner = this.winner;
        this.game.endDate = new Date();
        this.gameService.update(this.game);

        this.game.players.forEach((p) => {
            this.userService
                .get(p.player, this.getUser().token)
                .then((r) => {
                    r.totalPoints += p.score;
                    if (p.player == this.winner) r.totalVictories++;
                    this.userService
                        .update(r);
                })
        });
        this.modal
            .close()
            .then(() => {
                this.router.navigate(['/home']);
            });
    }

    checkUser(m: string) {
        if (this.getUser()._id == m && !this.playing) {
            this.playsAvailable = this.getMaxPlaysAvailable();
            this.playing = true;
        }
    }

    updateNotificationsList(index: number, ship: any) {
        let position = '';
        let shipShotName = '';
        if (index) {  // if the received index is null then its not needed
            console.log("Cell pressed index: " + index);
            position = this.getCelulaByIndex(index).posicao.linha + this.getCelulaByIndex(index).posicao.coluna;
        }

        switch (ship) {
            case TipoNavio.PortaAvioes:
                shipShotName = 'Carrier';
                break;
            case TipoNavio.Couracado:
                shipShotName = 'Battleship';
                break;
            case TipoNavio.Cruzador:
                shipShotName = 'Cruiser';
                break;
            case TipoNavio.ContraTorpedeiro:
                shipShotName = 'Destroyer';
                break;
            case TipoNavio.Submarino:
                shipShotName = 'Submarine';
                break;
        }

        this.notificationsList = [];
        if (this.playing || this.playsAvailable > 0) {
            this.notificationsList.push('Your turn to play. Shots available: ' + this.playsAvailable);
            if (this.playsAvailable < this.getMaxPlaysAvailable()) {
                let shipType = this.getCelulaByIndex(index).tipo;
                if (shipType == TipoCelula.Navio) {
                    this.notificationsList.push('You shot a ' + shipShotName + ' on position ' + position + '!');
                } else {
                    this.notificationsList.push('You missed on position ' + position + '!');
                }
            } else if (position && this.playsAvailable < this.getMaxPlaysAvailable()) {
                this.notificationsList.push('You missed on position ' + position + '!');
            }
        }
        else {
            this.notificationsList.push('Waiting for your turn to play...');
        }
    }

    getCelulaByIndex(index: number) {
        let line = Math.floor((index / 10));
        let column = (index % 10) + 1;
        return this.tabuleiro.getCelula(String.fromCharCode(65 + line), +column);
    }

    getMaxPlaysAvailable() {
        return (this.game.players.length - 1) * 2;
    }

    initBoards() {
        let players: any[] = [];
        this.game.players.forEach((p) => {
            if (p.player != this.getUser()._id) {
                players.push(p.player);
            }
        });
        players.forEach((p) => {
            this.elementos[p] = [];
            for (let i = 0; i < 100; i++) {
                this.elementos[p][i] = 0;
            }
        });
    }

    getUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    clickElemento(index: number, event: any) {
        let target = event.target || event.srcElement || event.currentTarget;
        let boardId = target.attributes.id.nodeValue;
        if (this.playsAvailable > 0 && target.style.backgroundColor == 'lightgray') {
            this.websocketService.sendClickElementMessage(this.game._id, boardId, index, --this.playsAvailable, this.getUser()._id, this.virar);
            if (this.playsAvailable == 0) this.playing = false;

            this.updateNotificationsList(index, '');
        }
    }

    getColor(elemento: number) {
        switch (elemento) {
            case 0:
                return 'lightgray';
            case 1:
                return 'blue';
            case 2:
                return 'red';
        }
        return 'white';
    }

    clearBoard(): void {
        document.getElementById('msgerro').innerText = '';
        this.ships.carriers.set = 0;
        this.ships.battleships.set = 0;
        this.ships.cruisers.set = 0;
        this.ships.destroyers.set = 0;
        this.ships.submarines.set = 0;
        this.tabuleiro = new Tabuleiro();
        this.drawBoard();
    }

    verifyIfAllShips(): boolean {
        let allShipsPlaced = true;
        this.tabuleiro.navios.forEach(navio => {
            switch (navio.tipoNavio) {
                case 0:
                    if (this.ships.carriers.set != this.ships.carriers.max) {
                        allShipsPlaced = false;
                    }
                    break;
                case 1:
                    if (this.ships.battleships.set != this.ships.battleships.max) {
                        allShipsPlaced = false;
                    }
                    break;
                case 2:
                    if (this.ships.cruisers.set != this.ships.cruisers.max) {
                        allShipsPlaced = false;
                    }
                    break;
                case 3:
                    if (this.ships.destroyers.set != this.ships.destroyers.max) {
                        allShipsPlaced = false;
                    }
                    break;
                case 4:
                    if (this.ships.submarines.set != this.ships.submarines.max) {
                        allShipsPlaced = false;
                    }
                    break;
            }
        });
        if (this.tabuleiro.navios.length < 10) {
            allShipsPlaced = false;
        }
        return allShipsPlaced;
    }

    ready() {
        this.websocketService.sendReadyMessage(this.game._id, this.getUser()._id, this.CircularJSON.stringify(this.tabuleiro));
    }

    preSetShips() {
        let tipo = (document.getElementById('shiptype') as any);
        let linha = (document.getElementById('line') as any);
        let coluna = (document.getElementById('column') as any);

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
        for (let s: number = 1; s < 8; s += 2) {
            coluna.value = s;
            this.addShip();  // Submarine 1, 2, 3 and 4
        }
    }

    drawBoard() {
        document.getElementById('msgerro').innerText = '';
        try {
            document.getElementById('tabela').innerHTML = "";
            let plainHtml = "";
            Tabuleiro.todasLinhas().forEach(linha => {
                plainHtml += "<tr><td>" + linha + "</td>";
                Tabuleiro.todasColunas().forEach(coluna => {
                    if (this.tabuleiro.getCelula(linha, coluna).tipo == TipoCelula.Navio)
                        plainHtml += "<td>X</td>";
                    else if (Posicao.existe(new Posicao(linha, coluna), this.tabuleiro.posicoesOcupadas))
                        plainHtml += "<td>.</td>";
                    else
                        plainHtml += "<td>&nbsp</td>";

                });
                plainHtml += "</tr>";
            });
            plainHtml += "<tr><td></td>";
            Tabuleiro.todasColunas().forEach(coluna => {
                plainHtml += "<td>" + coluna + "</td>";
            });
            plainHtml += "</tr>";
            document.getElementById('tabela').innerHTML = plainHtml;
            let tds = document.getElementsByTagName('td');
            for (let i = 0; i < tds.length; i++) {
                tds[i].style.border = '2px solid #FFF';
                tds[i].style.backgroundColor = 'lightgray';

                tds[i].style.width = '100px !important';
                tds[i].style.minWidth = '100px !important';
                tds[i].style.height = '100px !important';
            }

            plainHtml = "";
            document.getElementById('listanavios').innerHTML = "";
            this.tabuleiro.navios.forEach(navio => {
                plainHtml += "<li>" + navio.posicao.strValue() + " Tipo=" + navio.tipoNavio + ", Orientação=" + navio.orientacao + "</li>";
            });
            document.getElementById('listanavios').innerHTML = plainHtml;

        } catch (e) {
            document.getElementById('msgerro').innerText = e;
        }
    }

    addShip(): void {
        document.getElementById('msgerro').innerText = '';
        try {
            let tipo = (document.getElementById('shiptype') as any).value;
            let orient = (document.getElementById('orientation') as any).value;
            let linha = (document.getElementById('line') as any).value;
            if (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].indexOf(linha) < 0) {
                throw Error("Line value is invalid");
            }
            let coluna = (document.getElementById('column') as any).value;

            let tipoNavio = TipoNavio.PortaAvioes;
            switch (tipo) {
                case "0":
                    if (this.ships.carriers.set + 1 > 1)
                        throw Error("Maximum number of carriers is 1");
                    break;
                case "1":
                    tipoNavio = TipoNavio.Couracado;
                    if (this.ships.battleships.set + 1 > 1)
                        throw Error("Maximum number of battleships is 1");
                    break;
                case "2":
                    tipoNavio = TipoNavio.Cruzador;
                    if (this.ships.cruisers.set + 1 > 2)
                        throw Error("Maximum number of cruisers is 2");
                    break;
                case "3":
                    tipoNavio = TipoNavio.ContraTorpedeiro;
                    if (this.ships.destroyers.set + 1 > 3)
                        throw Error("Maximum number of destroyers is 3");
                    break;
                case "4":
                    tipoNavio = TipoNavio.Submarino;
                    if (this.ships.submarines.set + 1 > 4)
                        throw Error("Maximum number of submarines is 4");
                    break;
            }
            let orientacao = Orientacao.Normal;
            switch (orient) {
                case "1":
                    orientacao = Orientacao.Roda90;
                    break;
                case "2":
                    orientacao = Orientacao.Roda180;
                    break;
                case "3":
                    orientacao = Orientacao.Roda270;
                    break;
            }
            // Força cast para numero
            let col: number = +coluna;
            this.tabuleiro.adicionaNavio(tipoNavio, orientacao, linha, col);

            switch (tipoNavio) {
                case TipoNavio.PortaAvioes:
                    this.ships.carriers.set++;
                    break;
                case TipoNavio.Couracado:
                    this.ships.battleships.set++;
                    break;
                case TipoNavio.Cruzador:
                    this.ships.cruisers.set++;
                    break;
                case TipoNavio.ContraTorpedeiro:
                    this.ships.destroyers.set++;
                    break;
                case TipoNavio.Submarino:
                    this.ships.submarines.set++;
                    break;
            }
            this.drawBoard();
            this.verifyIfAllShips();

        } catch (e) {
            document.getElementById('msgerro').innerText = e;
        }
    }
}