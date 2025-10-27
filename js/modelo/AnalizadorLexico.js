import { Categoria } from './Categorias.js';
import { Token } from './Token.js';

export class AnalizadorLexico {

    //Inicio del Analizador Léxico HOLAAAAAAAAAAAA

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
            let token = this.extraerComentarios() ||
                        this.extraerCadenaCaracteres() ||
                        this.extraerLlaves() ||
                        this.extraerTerminal() ||             
                        this.extraerSeparador() ||
                        this.extraerComparacion() ||
                        this.extraerLogico() || 
                        this.extraerAsignacion() ||
                        this.extraerIncrementoDecremento()  ||
                        this.extraerParentesis() ||
                        this.extraerPalabraReservada() ||
                        this.extraerIdentificador() ||
                        this.extraerDecimal() ||
                        this.extraerEntero() ||
                        this.extraerOperadorAritmetico() 
                        

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

    // Autómata 1   
    extraerEntero() {
        let lexema = '';
        const categoria = Categoria.NUMERO_ENTERO;

        if (!this.esDigito(this.caracterActual())) {
            return null;
        }

        while (this.esDigito(this.caracterActual())) {
            lexema += this.caracterActual();
            this.avanzar();
        }

        if (lexema.length > 15) {
            return new Token(lexema, Categoria.ERROR_TOKEN_NO_RECONOCIDO, this.indice);
        }

        return new Token(lexema, categoria, this.indice);
    }

    // Autómata 2
    extraerDecimal() {
        const inicio = this.indice;
        let lexema = "";

        if (!this.esDigito(this.caracterActual())) {
            return null;
        }

        while (this.esDigito(this.caracterActual())) {
            lexema += this.caracterActual();
            this.avanzar();
        }

        if (this.caracterActual() === '.' && this.esDigito(this.caracterSiguiente())) {
            lexema += this.caracterActual(); 
            this.avanzar();

            while (this.esDigito(this.caracterActual())) {
                lexema += this.caracterActual();
                this.avanzar();
            }

            return new Token(lexema, Categoria.NUMERO_DECIMAL, inicio);
        } else {
            this.indice = inicio;
            return null;
        }
    } 
    
    // Autómata 3
    extraerIdentificador() {
    const inicio = this.indice;
    let lexema = '';

    const charInicial = this.caracterActual();
    if (!(this.esLetra(charInicial) || charInicial === '_')) {
        return null;
    }

    lexema += charInicial;
    this.avanzar();

    while (
        this.caracterActual() !== null &&
        (this.esLetra(this.caracterActual()) ||
        this.esDigito(this.caracterActual()) ||
        this.caracterActual() === '_')
    ) {
        lexema += this.caracterActual();
        this.avanzar();
    }

    if (lexema.length > 15) {
        console.warn(`❌ Identificador demasiado largo: "${lexema}" (${lexema.length} caracteres)`);

        return new Token(lexema, Categoria.ERROR_LONGITUD_IDENTIFICADOR, inicio);
    }

    return new Token(lexema, Categoria.IDENTIFICADOR, inicio);
}

    // Autómata 4: 
    extraerPalabraReservada() {
        const inicio = this.indice;
        let lexema = '';

        const palabrasReservadas = [
            'import', 'class', 'void', 'if', 'else',
            'for', 'while', 'return', 'break', 'continue',
            'new', 'this', 'super', 'const', 'final',
            'var', 'true', 'false', 'null'
        ];

        const charInicial = this.caracterActual();
        if (!this.esLetra(charInicial)) {
            return null;
        }

        lexema += charInicial;
        this.avanzar();

        while (
            this.caracterActual() !== null &&
            (this.esLetra(this.caracterActual()) || this.esDigito(this.caracterActual()))
        ) {
            lexema += this.caracterActual();
            this.avanzar();
        }

        if (palabrasReservadas.includes(lexema)) {
            return new Token(lexema, Categoria.PALABRA_RESERVADA, inicio);
        }

        this.indice = inicio; 
        return null;
    }

    // Autómata 5: Operadores aritméticos (+, -, *, /, %)
    extraerOperadorAritmetico() {
        const inicio = this.indice;
        const char = this.caracterActual();

        // Lista de operadores válidos en Dart
        const operadoresSimples = ['+', '-', '*', '/', '%'];

        // Doble operador (por ejemplo: ++ o --)
        const siguiente = this.caracterSiguiente();
        if ((char === '+' && siguiente === '+') || (char === '-' && siguiente === '-')) {
            const lexema = char + siguiente;
            this.avanzar(); 
            this.avanzar();
            return new Token(lexema, Categoria.OPERADOR_ARITMETICO, inicio);
        }

        // Operadores simples
        if (operadoresSimples.includes(char)) {
            this.avanzar();
            return new Token(char, Categoria.OPERADOR_ARITMETICO, inicio);
        }

        return null; // No es un operador aritmético
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

    //Autómata 11
    extraerLlaves() {
        const charActual = this.caracterActual();
        let lexema = null;
        let categoria = null;

        switch (charActual) {
            case '{':
                lexema = '{';
                categoria = Categoria.LLAVE_APERTURA;
                this.avanzar();
                break;
            case '}':
                lexema = '}';
                categoria = Categoria.LLAVE_CIERRE;
                this.avanzar();
                break;
            default:
                return null;
        }

        return new Token(lexema, categoria, this.indice - lexema.length);
    }

    //Autómata 12 
    extraerTerminal() {
        const charActual = this.caracterActual();

        if (charActual === ';') {
            const lexema = ';';
            this.avanzar();

            return new Token(lexema, Categoria.TERMINAL, this.indice - 1);
        }

        return null;
    }

    //Autómata 13
    extraerSeparador() {
        const charActual = this.caracterActual();

        if (charActual === ',') {
            const lexema = ',';
            this.avanzar();
            return new Token(lexema, Categoria.SEPARADOR, this.indice - 1);
        }

        return null;
    }

    //Autómata 14
    extraerCadenaCaracteres() {
        const charActual = this.caracterActual();
        const charSiguiente = this.caracterSiguiente();
        const charSiguiente2 = this.caracterSiguienteSiguiente();
        const posicionInicial = this.indice;
        
        let delimitador = null;
        let esMultilinea = false;

        if (charActual === '"') {
            if (charSiguiente === '"' && charSiguiente2 === '"') {
                delimitador = '"""';
                esMultilinea = true;
            } else {
                delimitador = '"';
            }
        } else if (charActual === '\'') {
            if (charSiguiente === '\'' && charSiguiente2 === '\'') {
                delimitador = "'''";
                esMultilinea = true;
            } else {
                delimitador = '\'';
            }
        }

        if (!delimitador) {
            return null;
        }

        for (let i = 0; i < delimitador.length; i++) {
            this.avanzar();
        }

        let lexema = delimitador;

        while (this.indice < this.codigoFuente.length) {
            let char = this.caracterActual();
            let finDelimitador = this.codigoFuente.substring(this.indice, this.indice + delimitador.length);
            
            if (!esMultilinea && (char === '\n' || char === '\r')) {

                const tokenError = new Token(
                    lexema,
                    Categoria.ERROR_CADENA_SIN_CERRAR,
                    posicionInicial
                );

                return tokenError;
            }

            if (char === '\\') {
                const charSiguienteEscape = this.caracterSiguiente();
                if (charSiguienteEscape !== '\0') {
                    lexema += char + charSiguienteEscape;
                    this.avanzar();
                    this.avanzar(); 
                } else {
                    this.avanzar(); 
                    const tokenError = new Token(
                        lexema,
                        Categoria.ERROR_CADENA_SIN_CERRAR,
                        posicionInicial
                    );
                    return tokenError;
                }
                continue;
            }

            if (finDelimitador === delimitador) {
                for (let i = 0; i < delimitador.length; i++) {
                    this.avanzar();
                }
                lexema += delimitador;
                return new Token(lexema, Categoria.CADENA_CARACTERES, posicionInicial);
            }

            lexema += char;
            this.avanzar();
        }

        return new Token(lexema, Categoria.ERROR_CADENA_SIN_CERRAR, posicionInicial);
    }

    //Autómata 15
    extraerComentarios() {
        const charActual = this.caracterActual();
        const charSiguiente = this.caracterSiguiente();
        const posicionInicial = this.indice;

        if (charActual === '/') {
            if (charSiguiente === '/') {
                this.avanzar(); this.avanzar();
                let lexema = '//';
                while (this.indice < this.codigoFuente.length && this.caracterActual() !== '\n' && this.caracterActual() !== '\r') {
                    lexema += this.caracterActual();
                    this.avanzar();
                }
                return new Token(lexema, Categoria.COMENTARIO_LINEA, posicionInicial);

            } else if (charSiguiente === '*') {
                this.avanzar(); this.avanzar();
                let lexema = '/*';
                let encontradoCierre = false;

                while (this.indice < this.codigoFuente.length) {
                    const char = this.caracterActual();
                    const nextChar = this.caracterSiguiente();

                    if (char === '*' && nextChar === '/') {
                        lexema += '*/';
                        this.avanzar(); this.avanzar();
                        encontradoCierre = true;
                        break;
                    }

                    lexema += char;
                    this.avanzar();
                }

                if (encontradoCierre) {
                    return new Token(lexema, Categoria.COMENTARIO_BLOQUE, posicionInicial);
                } else {

                    return new Token(lexema, Categoria.ERROR_BLOQUE_SIN_CERRAR, posicionInicial);
                }
            }
        }

        return null;
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