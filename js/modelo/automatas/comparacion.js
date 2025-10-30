import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerComparacion {
    //Autómata 6
    ejecutar(contexto) {
        const inicio = contexto.indice;
        const charActual = contexto.caracterActual();
        const charSiguiente = contexto.caracterSiguiente(); 
        
        let lexema = null;
        const categoria = Categoria.OPERADOR_COMPARACION;

        switch (charActual) {

            case '<':
                if (charSiguiente === '=') {
                    lexema = '<=';
                    contexto.avanzar(); 
                    contexto.avanzar(); 
                } else {
                    lexema = '<';
                    contexto.avanzar(); 
                }
                break;
            
            case '>':
                if (charSiguiente === '=') {
                    lexema = '>=';
                    contexto.avanzar(); 
                    contexto.avanzar(); 
                } else {
                    lexema = '>';
                    contexto.avanzar(); 
                }
                break;

            case '=':
                if (charSiguiente === '=') {
                    lexema = '==';
                    contexto.avanzar(); 
                    contexto.avanzar(); 
                } else {

                    return null; 
                }
                break;

            case '!':
                if (charSiguiente === '=') {
                    lexema = '!=';
                    contexto.avanzar(); 
                    contexto.avanzar(); 
                } else {

                    return null;
                }
                break;

            default:
                return null;
        }

        return new Token(lexema, categoria, inicio);
    }
}