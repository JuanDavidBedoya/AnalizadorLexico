import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerPunto {

    //Autómata 16
    ejecutar(contexto) {
        const inicio = contexto.indice;
        const charActual = contexto.caracterActual();

        if (charActual === '.') {
            const lexema = '.';
            contexto.avanzar();
            return new Token(lexema, Categoria.ACCESO, inicio - 1);
        }

        return null;
    }
}