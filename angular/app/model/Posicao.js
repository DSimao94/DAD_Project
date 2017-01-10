"use strict";
const GameValidator_1 = require("./GameValidator");
class Posicao {
    // Exemplos: A3; H10; A1; ...
    strValue() {
        return this.linha + this.coluna;
    }
    constructor(linha, coluna) {
        let linhaLetra;
        if (typeof linha === "string") {
            linhaLetra = linha[0];
        }
        else {
            linhaLetra = String.fromCharCode('A'.charCodeAt(0) + linha - 1);
        }
        if (!GameValidator_1.GameValidator.verificaColuna(coluna)) {
            throw new Error('Column value "' + coluna + '" is invalid');
        }
        if (!GameValidator_1.GameValidator.verificaLinha(linhaLetra)) {
            throw new Error('Line value "' + linhaLetra + '" is invalid');
        }
        this.linha = linhaLetra;
        this.coluna = coluna;
    }
    // A=1; B=2; ...
    linhaAsNumber() {
        return this.linha.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    }
    // index a começar em zero (A=0; B=1)
    linhaIndex() {
        return this.linhaAsNumber() - 1;
    }
    // index a começar em zero (Coluna1=0; Coluna2=1)
    colunaIndex() {
        return this.coluna - 1;
    }
    sobreposicao(p) {
        return (p.linha == this.linha) && (p.coluna == this.coluna);
    }
    // Extrair posições repetidas de um array
    static removeRepetidos(posicoes) {
        let result = [];
        for (let i = 0; i < posicoes.length; i++) {
            if (!Posicao.existe(posicoes[i], result)) {
                result.push(posicoes[i]);
            }
        }
        return result;
    }
    // Faz o merge de 2 arrays de Posicoes e retira os repetidos
    static merge(posicoes1, posicoes2) {
        let result = posicoes1;
        result = result.concat(posicoes2);
        return Posicao.removeRepetidos(result);
    }
    // Verifica se uma determinada posição existe num array
    static existe(posicao, arrayPosicoes) {
        for (let i = 0; i < arrayPosicoes.length; i++) {
            if (posicao.sobreposicao(arrayPosicoes[i])) {
                return true;
            }
        }
        return false;
    }
    // Verifica se existe algum conflito entre 2 arrays de posições
    // Considera-se que há conflito, se pelo menos uma posição aparecer nos 2 arrays
    static conflito(arrayPosicoes1, arrayPosicoes2) {
        for (let i = 0; i < arrayPosicoes1.length; i++) {
            if (Posicao.existe(arrayPosicoes1[i], arrayPosicoes2)) {
                return true;
            }
        }
        return false;
    }
}
exports.Posicao = Posicao;
