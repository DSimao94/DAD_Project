"use strict";
const GameValidator_1 = require("./GameValidator");
const Celula_1 = require("./Celula");
const Posicao_1 = require("./Posicao");
var TipoNavio;
(function (TipoNavio) {
    TipoNavio[TipoNavio["PortaAvioes"] = 0] = "PortaAvioes";
    TipoNavio[TipoNavio["Couracado"] = 1] = "Couracado";
    TipoNavio[TipoNavio["Cruzador"] = 2] = "Cruzador";
    TipoNavio[TipoNavio["ContraTorpedeiro"] = 3] = "ContraTorpedeiro";
    TipoNavio[TipoNavio["Submarino"] = 4] = "Submarino";
})(TipoNavio = exports.TipoNavio || (exports.TipoNavio = {}));
var Orientacao;
(function (Orientacao) {
    Orientacao[Orientacao["Normal"] = 0] = "Normal";
    Orientacao[Orientacao["Roda90"] = 1] = "Roda90";
    Orientacao[Orientacao["Roda180"] = 2] = "Roda180";
    Orientacao[Orientacao["Roda270"] = 3] = "Roda270";
})(Orientacao = exports.Orientacao || (exports.Orientacao = {}));
class Navio {
    // ------------------------------------------------------------------------------------------------
    // Interface Publica da classe - Membros Principais
    // ------------------------------------------------------------------------------------------------
    constructor(tipo, orientacao, linha, coluna) {
        if (!GameValidator_1.GameValidator.verificaOrientacao(tipo, orientacao)) {
            throw new Error('The orientation "' + orientacao + '" is invalid to the ships of type  "' + tipo + '".');
        }
        this.posicao = new Posicao_1.Posicao(linha, coluna);
        if (!GameValidator_1.GameValidator.verificaLimites(tipo, orientacao, this.posicao)) {
            throw new Error('The ship type "' + tipo + '" on position (' + linha + coluna + ') and orientation "' + orientacao + '" doesn\'t fit on the board\'s limits');
        }
        this.tipoNavio = tipo;
        this.orientacao = orientacao;
        this.celulas = [];
        this.posicoesOcupadas = this.calculaPosicoesOcupadas();
        this.preenchePosicoesVizinhas();
    }
    addCelula(celula) {
        if (!Posicao_1.Posicao.existe(celula.posicao, this.posicoesOcupadas)) {
            throw new Error('Not possible to add a cell to the ship.');
        }
        if (Celula_1.Celula.existe(celula, this.celulas)) {
            throw new Error('Not possible to add a cell to the ship, because there is already one cell on that position.');
        }
        if (celula.pertenceA != null) {
            throw new Error('Not possible to add a cell to the ship, because it is already associated to another ship.');
        }
        celula.pertenceA = this;
        celula.tipo = Celula_1.TipoCelula.Navio;
        this.celulas.push(celula);
    }
    totalTiros() {
        let total = 0;
        this.celulas.forEach(value => {
            value.tiro ? total++ : null;
        });
        return total;
    }
    afundou() {
        return this.totalTiros() == Navio.totalCelulasPorTipoNavio(this.tipoNavio);
    }
    // ------------------------------------------------------------------------------------------------
    // Métodos estátios auxiliares
    // ------------------------------------------------------------------------------------------------
    // Devolve o total de celulas que um tipo de navio tem
    static totalCelulasPorTipoNavio(tipo) {
        switch (tipo) {
            case TipoNavio.PortaAvioes:
                return 5;
            case TipoNavio.Couracado:
                return 4;
            case TipoNavio.Cruzador:
                return 3;
            case TipoNavio.ContraTorpedeiro:
                return 2;
            case TipoNavio.Submarino:
                return 1;
        }
        return 0;
    }
    calculaPosicoesOcupadas() {
        if (this.tipoNavio == TipoNavio.Submarino) {
            return [new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna)];
        }
        switch (this.orientacao) {
            case Orientacao.Normal:
                switch (this.tipoNavio) {
                    case TipoNavio.ContraTorpedeiro:
                        return [
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna + 1)
                        ];
                    case TipoNavio.Cruzador:
                        return [
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna + 1),
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna + 2)
                        ];
                    case TipoNavio.Couracado:
                        return [
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna + 1),
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna + 2),
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna + 3)
                        ];
                    case TipoNavio.PortaAvioes:
                        return [
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna + 1),
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna + 2),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() + 1, this.posicao.coluna + 1),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() + 2, this.posicao.coluna + 1),
                        ];
                }
                break;
            case Orientacao.Roda90:
                switch (this.tipoNavio) {
                    case TipoNavio.ContraTorpedeiro:
                        return [
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() + 1, this.posicao.coluna)
                        ];
                    case TipoNavio.Cruzador:
                        return [
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() + 1, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() + 2, this.posicao.coluna)
                        ];
                    case TipoNavio.Couracado:
                        return [
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() + 1, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() + 2, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() + 3, this.posicao.coluna)
                        ];
                    case TipoNavio.PortaAvioes:
                        return [
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() + 1, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() + 2, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() + 1, this.posicao.coluna - 1),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() + 1, this.posicao.coluna - 2),
                        ];
                }
                break;
            case Orientacao.Roda180:
                switch (this.tipoNavio) {
                    case TipoNavio.PortaAvioes:
                        return [
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna - 1),
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna - 2),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() - 1, this.posicao.coluna - 1),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() - 2, this.posicao.coluna - 1),
                        ];
                }
                break;
            case Orientacao.Roda270:
                switch (this.tipoNavio) {
                    case TipoNavio.PortaAvioes:
                        return [
                            new Posicao_1.Posicao(this.posicao.linha, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() - 1, this.posicao.coluna),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() - 1, this.posicao.coluna + 1),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() - 1, this.posicao.coluna + 2),
                            new Posicao_1.Posicao(this.posicao.linhaAsNumber() - 2, this.posicao.coluna),
                        ];
                }
        }
        throw new Error("Houve um erro ao calcular as posições do navio");
    }
    preenchePosicoesVizinhas() {
        let vizinhas = [];
        this.posicoesOcupadas.forEach(p => {
            let linhaInf = p.linhaAsNumber() - 1;
            let linhaSup = linhaInf + 2;
            let colunaInf = p.coluna - 1;
            let colunaSup = colunaInf + 2;
            linhaInf = linhaInf < 1 ? 1 : linhaInf;
            linhaSup = linhaSup > 10 ? 10 : linhaSup;
            colunaInf = colunaInf < 1 ? 1 : colunaInf;
            colunaSup = colunaSup > 10 ? 10 : colunaSup;
            for (let i = linhaInf; i <= linhaSup; i++)
                for (let j = colunaInf; j <= colunaSup; j++) {
                    vizinhas.push(new Posicao_1.Posicao(i, j));
                }
        });
        // Extrair posições repetidas do array
        this.posicoesVizinhas = Posicao_1.Posicao.removeRepetidos(vizinhas);
    }
}
exports.Navio = Navio;
