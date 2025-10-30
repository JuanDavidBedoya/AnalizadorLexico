import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerIdentificador {

    // Autómata 3
    ejecutar(contexto) {
        const inicio = contexto.indice;
        let lexema = '';

        const charInicial = contexto.caracterActual();
        if (!(contexto.esLetra(charInicial) || charInicial === '_')) {
            return null;
        }

        lexema += charInicial;
        contexto.avanzar();

        while (
            contexto.caracterActual() !== null &&
            (contexto.esLetra(contexto.caracterActual()) ||
             contexto.esDigito(contexto.caracterActual()) ||
             contexto.caracterActual() === '_')
        ) {
            lexema += contexto.caracterActual();
            contexto.avanzar();
        }

        if (lexema.length > 15) {
            return new Token(lexema, Categoria.ERROR_LONGITUD_IDENTIFICADOR, inicio);
        }
        return new Token(lexema, Categoria.IDENTIFICADOR, inicio);
    }
}