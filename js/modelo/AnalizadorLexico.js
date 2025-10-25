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
                        this.extraerLogico() || 
                        this.extraerAsignacion() ||
                        this.extraerIncrementoDecremento()  ||
                        this.extraerParentesis();

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

    //Autómata 8
    extraerAsignacion() {
        const charActual = this.caracterActual();
        const charSiguiente = this.caracterSiguiente();
        const charSiguiente2 = this.caracterSiguienteSiguiente();
        
        let lexema = null;
        const categoria = Categoria.OPERADOR_ASIGNACION;

        switch (charActual) {

            case '=':

                lexema = '=';
                this.avanzar();
                break;
            case '+':
            case '-':
            case '*':
            case '%':
            case '&':
            case '|':
            case '^':
                if (charSiguiente === '=') {
                    lexema = charActual + '=';
                    this.avanzar(); this.avanzar();
                } else {
                    return null; 
                }
                break;

            case '/':
                if (charSiguiente === '=') {
                    lexema = '/=';
                    this.avanzar(); this.avanzar();
                } else {
                    return null; 
                }
                break;

            case '?':
                if (charSiguiente === '?' && charSiguiente2 === '=') {
                    lexema = '??=';
                    this.avanzar(); this.avanzar(); this.avanzar();
                } else {
                    return null; 
                }
                break;

            case '~':
                if (charSiguiente === '/' && charSiguiente2 === '=') {
                    lexema = '~/=';
                    this.avanzar(); this.avanzar(); this.avanzar();
                } else {
                    return null; 
                }
                break;

            case '<':
                if (charSiguiente === '<' && charSiguiente2 === '=') {
                    lexema = '<<=';
                    this.avanzar(); this.avanzar(); this.avanzar();
                } else {
                    return null; 
                }
                break;

            case '>':
                if (charSiguiente === '>' && charSiguiente2 === '=') {
                    lexema = '>>=';
                    this.avanzar(); this.avanzar(); this.avanzar();
                } else if (charSiguiente === '>' && charSiguiente2 === '>' && this.caracterSiguienteSiguienteSiguiente() === '=') {
                    lexema = '>>>=';
                    this.avanzar(); this.avanzar(); this.avanzar(); this.avanzar();
                } else {
                    return null; 
                }
                break;

            default:
                return null;
        }

        return new Token(lexema, categoria, this.indice);
    }

    //Autómata 9
    extraerIncrementoDecremento() {
        const charActual = this.caracterActual();
        const charSiguiente = this.caracterSiguiente();

        let lexema = null;
        let categoria = null;

        switch (charActual) {

            case '+':
                if (charSiguiente === '+') {

                    lexema = '++';
                    categoria = Categoria.OPERADOR_INCREMENTO_DECREMENTO;
                    this.avanzar(); 
                    this.avanzar(); 
                } else {
                    return null; 
                }
                break;

            case '-':
                if (charSiguiente === '-') {

                    lexema = '--';
                    categoria = Categoria.OPERADOR_INCREMENTO_DECREMENTO;
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

    //Autómata 10
    extraerParentesis() {
        const charActual = this.caracterActual();
        let lexema = null;
        let categoria = null;

        switch (charActual) {
            case '(':
                lexema = '(';
                categoria = Categoria.PARENTESIS_APERTURA;
                this.avanzar(); 
                break;
            case ')':
                lexema = ')';
                categoria = Categoria.PARENTESIS_CIERRE;
                this.avanzar();
                break;
            default:
                return null;
        }

        return new Token(lexema, categoria, this.indice);
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