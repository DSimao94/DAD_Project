"use strict";
const Posicao_1 = require("./Posicao");
var TipoCelula;
(function (TipoCelula) {
    TipoCelula[TipoCelula["Mar"] = 0] = "Mar";
    TipoCelula[TipoCelula["Navio"] = 1] = "Navio";
})(TipoCelula = exports.TipoCelula || (exports.TipoCelula = {}));
class Celula {
    constructor(linha, coluna) {
        this.posicao = new Posicao_1.Posicao(linha, coluna);
        this.tipo = TipoCelula.Mar;
        this.tiro = false;
        this.pertenceA = null;
    }
    sobreposicao(c) {
        return (c.posicao.linha == this.posicao.linha) && (c.posicao.coluna == this.posicao.coluna);
    }
    // Verifica se uma determinada celula existe num array
    static existe(celula, arrayCelulas) {
        for (let i = 0; i < arrayCelulas.length; i++) {
            if (celula.sobreposicao(arrayCelulas[i])) {
                return true;
            }
        }
        return false;
    }
}
exports.Celula = Celula;
