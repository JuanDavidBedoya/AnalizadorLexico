import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerIncrementoDecremento {  

    //Autómata 9
    ejecutar(contexto) {
        const inicio = contexto.indice;
        const charActual = contexto.caracterActual();
        const charSiguiente = contexto.caracterSiguiente();

        let lexema = null;
        let categoria = null;

        switch (charActual) {

            case '+':
                if (charSiguiente === '+') {

                    lexema = '++';
                    categoria = Categoria.OPERADOR_INCREMENTO;
                    contexto.avanzar(); 
                    contexto.avanzar(); 
                } else {
                    return null; 
                }
                break;

            case '-':
                if (charSiguiente === '-') {

                    lexema = '--';
                    categoria = Categoria.OPERADOR_DECREMENTO;
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