import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerParentesis {    
    //Autómata 10
    ejecutar(contexto) {
        const inicio = contexto.indice;
        const charActual = contexto.caracterActual();
        let lexema = null;
        let categoria = null;

        switch (charActual) {
            case '(':
                lexema = '(';
                categoria = Categoria.PARENTESIS_APERTURA;
                contexto.avanzar(); 
                break;
            case ')':
                lexema = ')';
                categoria = Categoria.PARENTESIS_CIERRE;
                contexto.avanzar();
                break;
            default:
                return null;
        }

        return new Token(lexema, categoria, inicio);
    }
}
