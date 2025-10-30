import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerCorchetes {    
    //Autómata 10
    ejecutar(contexto) {
        const inicio = contexto.indice;
        const charActual = contexto.caracterActual();
        let lexema = null;
        let categoria = null;

        switch (charActual) {
            case '[':
                lexema = '[';
                categoria = Categoria.CORCHETE_APERTURA;
                contexto.avanzar(); 
                break;
            case ']':
                lexema = ']';
                categoria = Categoria.CORCHETE_CIERRE;
                contexto.avanzar();
                break;
            default:
                return null;
        }

        return new Token(lexema, categoria, inicio);
    }
}
