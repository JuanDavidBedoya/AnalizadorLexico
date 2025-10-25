import { Categoria } from './Categorias.js';
import { Token } from './Token.js';

export class AnalizadorLexico {

    constructor(codigoFuente) {
        this.codigoFuente = codigoFuente;
        this.tokens = [];
        this.indice = 0; 
    }

    analizar() {
        while (this.indice < this.codigoFuente.length) {
            const charActual = this.caracterActual();

            // 1. Omitir espacios en blanco, tabs y saltos de línea
            if (this.esEspacio(charActual)) {
                this.consumirEspacios();
                continue;
            }

            // 2. Comprobación de todos los tokens, aquí se llaman los autómatas
            let token = this.extraerComparacion() ||
                        this.extraerLogico();

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

    //Autómata 6
    extraerComparacion() {
        const charActual = this.caracterActual();
        const charSiguiente = this.caracterSiguiente(); 
        
        let lexema = null;
        const categoria = Categoria.OPERADOR_COMPARACION;

        switch (charActual) {
            // Caso: < ó <=
            case '<':
                if (charSiguiente === '=') {
                    lexema = '<=';
                    this.avanzar(); 
                    this.avanzar(); 
                } else {
                    lexema = '<';
                    this.avanzar(); 
                }
                break;
            
            case '>':
                if (charSiguiente === '=') {
                    lexema = '>=';
                    this.avanzar(); 
                    this.avanzar(); 
                } else {
                    lexema = '>';
                    this.avanzar(); 
                }
                break;

            case '=':
                if (charSiguiente === '=') {
                    lexema = '==';
                    this.avanzar(); 
                    this.avanzar(); 
                } else {

                    return null; 
                }
                break;

            case '!':
                if (charSiguiente === '=') {
                    lexema = '!=';
                    this.avanzar(); 
                    this.avanzar(); 
                } else {

                    return null;
                }
                break;

            default:
                return null;
        }

        return new Token(lexema, categoria, this.indice);
    }

    //Autómata 7
    extraerLogico() {
        const charActual = this.caracterActual();
        const charSiguiente = this.caracterSiguiente(); 
        
        let lexema = null;
        const categoria = Categoria.OPERADOR_LOGICO;

        switch (charActual) {
            case '|':
                if (charSiguiente === '|') {
                    lexema = '||';
                    this.avanzar(); 
                    this.avanzar(); 
                } else {
                    return null; 
                }
                break;
            
            case '&':
                if (charSiguiente === '&') {
                    lexema = '&&';
                    this.avanzar(); 
                    this.avanzar(); 
                } else {
                    return null; 
                }
                break;

            case '!':

                lexema = '!';
                this.avanzar();
                break;

            default:
                return null;
        }
        return new Token(lexema, categoria, this.indice);
    }
    
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
}