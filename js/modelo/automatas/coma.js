import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerComa {

    //Autómata 13
    ejecutar(contexto) {
        const inicio = contexto.indice;
        const charActual = contexto.caracterActual();

        if (charActual === ',') {
            const lexema = ',';
            contexto.avanzar();
            return new Token(lexema, Categoria.SEPARADOR, inicio - 1);
        }

        return null;
    }
}