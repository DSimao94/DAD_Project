"use strict";
const Navio_1 = require("./Navio");
const Celula_1 = require("./Celula");
const posicao_1 = require("./posicao");
class Tabuleiro {
    constructor() {
        this.celulas = [];
        this.posicoesOcupadas = [];
        this.navios = [];
        Tabuleiro.todasLinhas().forEach(letra => {
            Tabuleiro.todasColunas().forEach(coluna => {
                let c = new Celula_1.Celula(letra, coluna);
                this.celulas.push(c);
            });
        });
    }
    // Devolve a célula que está na posição linha, coluna
    getCelula(linha, coluna) {
        let posicao = new posicao_1.Posicao(linha, coluna);
        return this.celulas[posicao.linhaIndex() * 10 + posicao.colunaIndex()];
    }
    adicionaNavio(tipo, orientacao, linha, coluna) {
        try {
            let navio = new Navio_1.Navio(tipo, orientacao, linha, coluna);
            if (posicao_1.Posicao.conflito(navio.posicoesOcupadas, this.posicoesOcupadas)) {
                throw new Error('The ship "' + tipo + '" on position (' + linha + coluna + ') and orientation "' + orientacao + '" is overlapping or leaning against an existing ship');
            }
            navio.posicoesOcupadas.forEach(p => {
                navio.addCelula(this.getCelula(p.linha, p.coluna));
            });
            this.posicoesOcupadas = posicao_1.Posicao.merge(this.posicoesOcupadas, navio.posicoesVizinhas);
            this.navios.push(navio);
            return navio;
        }
        catch (e) {
            // Alterar para fazer tratamento de erros
            throw e;
        }
    }
    // Devolve as células na forma de matriz - usar só para testes (performance inferior à propriedade celulas)
    celulasMatrix() {
        let c = [];
        Tabuleiro.todasLinhas().forEach(linha => {
            let l = [];
            Tabuleiro.todasColunas().forEach(coluna => {
                l.push(this.getCelula(linha, coluna));
            });
            c.push(l);
        });
        return c;
    }
    // ------------------------------------------------------------------------------------------------
    // Métodos estátios auxiliares
    // ------------------------------------------------------------------------------------------------
    static todasLinhas() {
        return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    }
    static todasColunas() {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }
}
exports.Tabuleiro = Tabuleiro;
