import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerCadenaCaracteres {
    
    //Autómata 14
    ejecutar(contexto) {
        const posicionInicial = contexto.indice;
        const charActual = contexto.caracterActual();
        const charSiguiente = contexto.caracterSiguiente();
        const charSiguiente2 = contexto.caracterSiguienteSiguiente();

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

        for (let k = 0; k < delimitador.length; k++) contexto.avanzar();

        let lexema = delimitador;
        let categoriaError = null; 

        const escapesValidos = ['n', 'r', 't', '\'', '"', '\\'];

        while (contexto.indice < contexto.codigoFuente.length) {
            const c = contexto.caracterActual();
            const finDelimitador = contexto.codigoFuente.substring(contexto.indice, contexto.indice + delimitador.length); 

            if (!esMultilinea && (c === '\n' || c === '\r')) {
                return new Token(lexema, Categoria.ERROR_CADENA_SIN_CERRAR, posicionInicial);
            }

            if (c === '\\') {
                const next = contexto.caracterSiguiente();

                if (next === '\0') {
                    lexema += '\\';
                    contexto.avanzar();
                    if (!categoriaError) categoriaError = Categoria.ERROR_CADENA_SIN_CERRAR;
                }
                else if (!escapesValidos.includes(next)) {
                    lexema += '\\' + next;
                    contexto.avanzar(); contexto.avanzar();
                    if (!categoriaError) categoriaError = Categoria.ERROR_ESCAPE_INVALIDO;
                    continue; 
                }
                else { 
                    lexema += '\\' + next;
                    contexto.avanzar(); contexto.avanzar();
                    continue;
                }
            }

            if (finDelimitador === delimitador) {
                if (delimitador.length === 1) {
                    let j = contexto.indice - 1;
                    let countBackslashes = 0;
                    while (j >= 0 && contexto.codigoFuente.charAt(j) === '\\') {
                        countBackslashes++;
                        j--;
                    }
                    if (countBackslashes % 2 === 0) {
                        contexto.avanzar();
                        lexema += delimitador;
                        const categoriaFinal = categoriaError || Categoria.CADENA_CARACTERES;
                        return new Token(lexema, categoriaFinal, posicionInicial);
                    }
                } else {
                    for (let k = 0; k < 3; k++) {
                        lexema += contexto.caracterActual();
                        contexto.avanzar();
                    }
                    const categoriaFinal = categoriaError || Categoria.CADENA_CARACTERES;
                    return new Token(lexema, categoriaFinal, posicionInicial);
                }
            }

            lexema += c;
            contexto.avanzar();
        }
        const categoriaFinalError = categoriaError || Categoria.ERROR_CADENA_SIN_CERRAR;
        return new Token(lexema, categoriaFinalError, posicionInicial);
    }
}