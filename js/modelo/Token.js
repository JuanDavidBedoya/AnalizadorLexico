import { Categoria } from './Categorias.js';

export class Token {
    /**
     * @param {string} lexema 
     * @param {Categoria} categoria 
     * @param {number} posicion 
     */
    constructor(lexema, categoria, posicion) {
        this.lexema = lexema;
        this.categoria = categoria;
        this.posicion = posicion; 
    }
    toString() {
        return `Token [${this.categoria}] (${this.lexema}) en pos: ${this.posicion}`;
    }
}