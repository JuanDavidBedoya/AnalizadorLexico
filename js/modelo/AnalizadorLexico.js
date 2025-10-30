import { Categoria } from './Categorias.js';
import { Token } from './Token.js';
import { extraerEntero } from './automatas/enteros.js';
import { extraerDecimal } from './automatas/decimales.js';
import { extraerIdentificador } from './automatas/identificadores.js';
import { extraerPalabraReservada } from './automatas/reservadas.js';
import { extraerOperadorAritmetico } from './automatas/aritmeticos.js';
import { extraerComparacion } from './automatas/comparacion.js';
import { extraerLogicos } from './automatas/logicos.js';
import { extraerAsignacion } from './automatas/asignacion.js';
import { extraerIncrementoDecremento } from './automatas/incrementoDecremento.js';
import { extraerParentesis } from './automatas/parentesis.js';
import { extraerLlaves } from './automatas/llaves.js';
import { extraerTerminal } from './automatas/terminal.js';
import { extraerComa } from './automatas/coma.js';
import { extraerCadenaCaracteres } from './automatas/cadenas.js';
import { extraerComentarios } from './automatas/comentarios.js';
import { extraerPunto } from './automatas/acceso.js';
import { extraerCorchetes } from './automatas/corchetes.js';

export class AnalizadorLexico {

    //Inicio del Analizador Léxico 

    constructor(codigoFuente) {
        this.codigoFuente = codigoFuente;
        this.tokens = [];
        this.indice = 0; 
        this.estrategias = [
            new extraerComentarios(), //Autómata 15
            new extraerCadenaCaracteres(), //Autómata 14
            new extraerIncrementoDecremento(), //Autómata 9
            new extraerComparacion(), //Autómata 6
            new extraerLogicos(), //Autómata 7
            new extraerAsignacion(), //Autómata 8
            new extraerOperadorAritmetico(), //Autómata 5
            new extraerDecimal(), //Autómata 2
            new extraerEntero(), //Autómata 1 - 
            new extraerPalabraReservada(), //Autómata 4
            new extraerIdentificador(), //Autómata 3
            new extraerLlaves(), //Autómata 11
            new extraerParentesis(), //Autómata 10
            new extraerComa(), //Autómata 13
            new extraerTerminal(), //Autómata 12      
            new extraerPunto(), //Autómata 16              
            new extraerCorchetes() //Autómata 10
        ];
    }

    analizar() {
        while (this.indice < this.codigoFuente.length) {
            const charActual = this.caracterActual();

            // 1. Omitir espacios en blanco
            if (this.esEspacio(charActual)) {
                this.consumirEspacios();
                continue;
            }

            // 2. Llamar a cada estrategia en orden, aquí se llama a los autómatas
            let token = null;
            for (const estrategia of this.estrategias) {
                token = estrategia.ejecutar(this); 
                if (token) {
                    break; 
                }
            }
         
            if (token) {
                this.tokens.push(token);
            } else {
                // 3. Token no reconocido
                if (this.indice < this.codigoFuente.length) {
                    const lexemaError = this.codigoFuente.charAt(this.indice);
                    this.avanzar(); 
                    
                    const tokenError = new Token(
                        lexemaError,
                        Categoria.ERROR_TOKEN_NO_RECONOCIDO,
                        this.indice 
                    );
                    this.tokens.push(tokenError);
                }
            }
        }
        return this.tokens;
    }

    //Métodos auxiliares
    
    avanzar() {
        this.indice++;
    }

    caracterActual() {
        if (this.indice >= this.codigoFuente.length) {
            return '\0'; 
        }
        return this.codigoFuente.charAt(this.indice);
    }
    
    caracterSiguiente() {
        if (this.indice + 1 >= this.codigoFuente.length) {
            return '\0'; 
        }
        return this.codigoFuente.charAt(this.indice + 1);
    }

    consumirEspacios() {
        while (this.esEspacio(this.caracterActual())) {
            this.avanzar();
        }
    }

    esEspacio(char) {
        return char === ' ' || char === '\t' || char === '\r' || char === '\n';
    }

    esDigito(char) {
        return char >= '0' && char <= '9';
    }

    esLetra(char) {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
    }

    caracterSiguienteSiguiente() {
        if (this.indice + 2 >= this.codigoFuente.length) return '\0'; 
        return this.codigoFuente.charAt(this.indice + 2);
    }

    caracterSiguienteSiguienteSiguiente() {
        if (this.indice + 3 >= this.codigoFuente.length) return '\0'; 
        return this.codigoFuente.charAt(this.indice + 3);
    }
}