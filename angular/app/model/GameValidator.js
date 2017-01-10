"use strict";
const Tabuleiro_1 = require("./Tabuleiro");
const Navio_1 = require("./Navio");
const Navio_2 = require("./Navio");
class GameValidator {
    // Verifica se os valores da coluna estão corretos
    static verificaColuna(coluna) {
        if ((coluna < 1) || (coluna > 10)) {
            return false;
        }
        return true;
    }
    // Verifica se os valores da linha estão corretos
    static verificaLinha(linha) {
        return Tabuleiro_1.Tabuleiro.todasLinhas().indexOf(linha) > -1;
    }
    // Verifica se o valor da orientacao é adequado ao tipo de navio
    static verificaOrientacao(tipo, orientacao) {
        switch (tipo) {
            case Navio_1.TipoNavio.PortaAvioes:
                return true;
            case Navio_1.TipoNavio.Couracado:
            case Navio_1.TipoNavio.Cruzador:
            case Navio_1.TipoNavio.ContraTorpedeiro:
                return (orientacao == Navio_2.Orientacao.Normal) || (orientacao == Navio_2.Orientacao.Roda90);
            case Navio_1.TipoNavio.Submarino:
                return (orientacao == Navio_2.Orientacao.Normal);
        }
    }
    // Verifica se um navio de um determinado tipo e com determinada orientação, cabe ou não dentro do tabuleiro
    static verificaLimites(tipo, orientacao, posicao) {
        //console.log('VERIFICA LIMITES');
        //console.log('Tipo = '+tipo);
        //console.log('Orientacao = '+orientacao);
        //console.log(typeof posicao.coluna);
        //console.log('Posicao = '+posicao.strValue());
        if (tipo == Navio_1.TipoNavio.Submarino) {
            return true;
        }
        let offsetVertical = 0;
        let offsetHorizontal = 0;
        switch (orientacao) {
            case Navio_2.Orientacao.Normal:
                switch (tipo) {
                    case Navio_1.TipoNavio.PortaAvioes:
                        offsetVertical = 2;
                        offsetHorizontal = 2;
                        break;
                    case Navio_1.TipoNavio.Couracado:
                        offsetHorizontal = 3;
                        break;
                    case Navio_1.TipoNavio.Cruzador:
                        offsetHorizontal = 2;
                        break;
                    case Navio_1.TipoNavio.ContraTorpedeiro:
                        offsetHorizontal = 1;
                        break;
                }
                break;
            case Navio_2.Orientacao.Roda90:
                switch (tipo) {
                    case Navio_1.TipoNavio.PortaAvioes:
                        offsetVertical = 2;
                        offsetHorizontal = -2;
                        break;
                    case Navio_1.TipoNavio.Couracado:
                        offsetVertical = 3;
                        break;
                    case Navio_1.TipoNavio.Cruzador:
                        offsetVertical = 2;
                        break;
                    case Navio_1.TipoNavio.ContraTorpedeiro:
                        offsetVertical = 1;
                        break;
                }
                break;
            case Navio_2.Orientacao.Roda180:
                if (tipo === Navio_1.TipoNavio.PortaAvioes) {
                    offsetVertical = -2;
                    offsetHorizontal = -2;
                }
                else {
                    return false;
                }
                break;
            case Navio_2.Orientacao.Roda270:
                if (tipo === Navio_1.TipoNavio.PortaAvioes) {
                    offsetVertical = -2;
                    offsetHorizontal = 2;
                }
                else {
                    return false;
                }
        }
        //console.log("posicao.coluna");
        //console.log(posicao.coluna);
        //console.log(typeof posicao.coluna);
        //console.log("offsetHorizontal");
        //console.log(offsetHorizontal);
        //console.log(typeof offsetHorizontal);
        //console.log(posicao.coluna + offsetHorizontal);
        if (((posicao.coluna + offsetHorizontal) < 1) || ((posicao.coluna + offsetHorizontal) > 10)) {
            return false;
        }
        //console.log("posicao.linhaAsNumber()");
        //console.log(posicao.linhaAsNumber());
        //console.log("offsetVertical");
        //console.log(offsetVertical);
        if (((posicao.linhaAsNumber() + offsetVertical) < 1) || ((posicao.linhaAsNumber() + offsetVertical) > 10)) {
            return false;
        }
        return true;
    }
}
exports.GameValidator = GameValidator;
