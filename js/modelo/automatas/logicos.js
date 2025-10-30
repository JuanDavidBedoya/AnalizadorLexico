import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerLogicos { 
    
    //Autómata 7
    ejecutar(contexto) {
        const inicio = contexto.indice;
        const charActual = contexto.caracterActual();
        const charSiguiente = contexto.caracterSiguiente(); 
        
        let lexema = null;
        const categoria = Categoria.OPERADOR_LOGICO;

        switch (charActual) {
            case '|':
                if (charSiguiente === '|') {
                    lexema = '||';
                    contexto.avanzar(); 
                    contexto.avanzar(); 
                } else {
                    return null; 
                }
                break;
            
            case '&':
                if (charSiguiente === '&') {
                    lexema = '&&';
                    contexto.avanzar(); 
                    contexto.avanzar(); 
                } else {
                    return null; 
                }
                break;

            case '!':

                lexema = '!';
                contexto.avanzar();
                break;

            default:
                return null;
        }
        return new Token(lexema, categoria, inicio);
    }
}