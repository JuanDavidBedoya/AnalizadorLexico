import { Categoria } from './Categorias.js';
import { Token } from './Token.js';

export class AnalizadorLexico {

    //Inicio del Analizador Léxico 

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
            let token = this.extraerComentarios() || //Autómata 15
                        this.extraerCadenaCaracteres() || //Autómata 14
                        this.extraerIncrementoDecremento() || //Autómata 9
                        this.extraerComparacion() || //Autómata 6
                        this.extraerLogico() || //Autómata 7
                        this.extraerAsignacion() || //Autómata 8
                        this.extraerOperadorAritmetico() || //Autómata 5
                        this.extraerDecimal() || //Autómata 2
                        this.extraerEntero() || //Autómata 1
                        this.extraerPalabraReservada() || //Autómata 4
                        this.extraerIdentificador() || //Autómata 3
                        this.extraerLlaves() || //Autómata 11
                        this.extraerParentesis() || //Autómata 10
                        this.extraerSeparador() || //Autómata 13
                        this.extraerTerminal(); //Autómata 12
                        

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
            return new Token(lexema, Categoria.ERROR_LONGITUD_IDENTIFICADOR, inicio);
        }
        return new Token(lexema, Categoria.IDENTIFICADOR, inicio);
    }

    // Autómata 4
    extraerPalabraReservada() {
        const inicio = this.indice;
        let lexema = '';

        const palabrasReservadas = [

        'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return', 'yield', 'await', 'async', 'try', 'catch', 'throw', 'finally',

        'class', 'enum', 'mixin', 'extends', 'implements', 'with', 'abstract', 'interface', 'typedef', 'import', 'export', 'library', 'part', 'of',

        'var', 'final', 'const', 'late', 'static', 'dynamic', 'void', 'null', 'true', 'false', 'this', 'super', 'new',

        'int', 'double', 'num', 'bool', 'String', 'List', 'Map', 'Set', 'Object', 'Future', 'Stream',

        'operator', 'get', 'set', 'required', 'covariant', 'external', 'factory', 'assert', 'in', 'is', 'as', 'on', 'show', 'hide',

        'deferred', 'rethrow', 'sync'
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

    // Autómata 5
    extraerOperadorAritmetico() {
        const inicio = this.indice;
        const char = this.caracterActual();

        const operadoresSimples = ['+', '-', '*', '/', '%'];

        const siguiente = this.caracterSiguiente();
        if ((char === '~' && siguiente === '/')) {
            const lexema = char + siguiente;
            this.avanzar(); 
            this.avanzar();
            return new Token(lexema, Categoria.OPERADOR_ARITMETICO, inicio);
        }

        if (operadoresSimples.includes(char)) {
            this.avanzar();
            return new Token(char, Categoria.OPERADOR_ARITMETICO, inicio);
        }

        return null; 
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
            
            case ':':
                lexema = ':';
                this.avanzar(); 
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
        const posicionInicial = this.indice;

        const charActual = this.caracterActual();
        const charSiguiente = this.caracterSiguiente();
        const charSiguiente2 = this.caracterSiguienteSiguiente();

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
        } else {
            return null;
        }

        for (let k = 0; k < delimitador.length; k++) this.avanzar();

        let lexema = delimitador;

        const escapesValidos = ['n', 'r', 't', '\'', '"', '\\'];

        while (this.indice < this.codigoFuente.length) {
            const c = this.caracterActual();
            const finDelimitador = this.codigoFuente.substring(this.indice, this.indice + delimitador.length);

            if (!esMultilinea && (c === '\n' || c === '\r')) {
                return new Token(lexema, Categoria.ERROR_CADENA_SIN_CERRAR, posicionInicial);
            }

            if (c === '\\') {
                const next = this.caracterSiguiente();

                if (next === '\0') {
                    lexema += '\\';
                    this.avanzar();
                    return new Token(lexema, Categoria.ERROR_CADENA_SIN_CERRAR, posicionInicial);
                }

                if (!escapesValidos.includes(next)) {
                    lexema += '\\' + next;
                    this.avanzar(); this.avanzar();
                    return new Token(lexema, Categoria.ERROR_ESCAPE_INVALIDO, posicionInicial);
                }

                lexema += '\\' + next;
                this.avanzar(); this.avanzar();
                continue;
            }

            if (finDelimitador === delimitador) {
                if (delimitador.length === 1) {
                    let j = this.indice - 1;
                    let countBackslashes = 0;
                    while (j >= 0 && this.codigoFuente.charAt(j) === '\\') {
                        countBackslashes++;
                        j--;
                    }
                    if (countBackslashes % 2 === 0) {
                        this.avanzar();
                        lexema += delimitador;
                        return new Token(lexema, Categoria.CADENA_CARACTERES, posicionInicial);
                    }
                } else {
                    for (let k = 0; k < 3; k++) {
                        lexema += this.caracterActual();
                        this.avanzar();
                    }
                    return new Token(lexema, Categoria.CADENA_CARACTERES, posicionInicial);
                }
            }

            lexema += c;
            this.avanzar();
        }

        return new Token(lexema, Categoria.ERROR_CADENA_SIN_CERRAR, posicionInicial);
    }

    //Autómata 15
    extraerComentarios() {
        const charActual = this.caracterActual();
        const charSiguiente = this.caracterSiguiente();
        const charSiguiente2 = this.caracterSiguienteSiguiente();
        const posicionInicial = this.indice;

        if (charActual === '/') {
            if (charSiguiente === '/') {
                
                let categoria = Categoria.COMENTARIO_LINEA;
                let lexemaInicial = '//';

                if (charSiguiente2 === '/') {
                    categoria = Categoria.COMENTARIO_DOCUMENTACION; 
                    lexemaInicial = '///';
                    this.avanzar();
                }

                this.avanzar(); this.avanzar(); 

                let lexema = lexemaInicial;
                while (this.indice < this.codigoFuente.length && this.caracterActual() !== '\n' && this.caracterActual() !== '\r') {
                    lexema += this.caracterActual();
                    this.avanzar();
                }
                return new Token(lexema, categoria, posicionInicial);

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