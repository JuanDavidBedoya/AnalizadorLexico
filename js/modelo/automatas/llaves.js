import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerLlaves {
    //Autómata 11
    ejecutar(contexto) {
        const inicio = contexto.indice;
        const charActual = contexto.caracterActual();
        let lexema = null;
        let categoria = null;

        switch (charActual) {
            case '{':
                lexema = '{';
                categoria = Categoria.LLAVE_APERTURA;
                contexto.avanzar();
                break;
            case '}':
                lexema = '}';
                categoria = Categoria.LLAVE_CIERRE;
                contexto.avanzar();
                break;
            default:
                return null;
        }

        return new Token(lexema, categoria, inicio - lexema.length);
    }
}