import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerAsignacion {
    //Autómata 8
    ejecutar(contexto) {
        const inicio = contexto.indice;
        const charActual = contexto.caracterActual();
        const charSiguiente = contexto.caracterSiguiente();
        const charSiguiente2 = contexto.caracterSiguienteSiguiente();
        
        let lexema = null;
        const categoria = Categoria.OPERADOR_ASIGNACION;

        switch (charActual) {

            case '=':

                lexema = '=';
                contexto.avanzar();
                break;
            case '+':
            case '-':
            case '*':
            case '%':
            case '&':
            case '|':
            case '^':
                if (charSiguiente === '=') {
                    lexema = charActual + '=';
                    contexto.avanzar(); contexto.avanzar();
                } else {
                    return null; 
                }
                break;

            case '/':
                if (charSiguiente === '=') {
                    lexema = '/=';
                    contexto.avanzar(); contexto.avanzar();
                } else {
                    return null; 
                }
                break;

            case '?':
                if (charSiguiente === '?' && charSiguiente2 === '=') {
                    lexema = '??=';
                    contexto.avanzar(); contexto.avanzar(); contexto.avanzar();
                } else {
                    return null; 
                }
                break;

            case '~':
                if (charSiguiente === '/' && charSiguiente2 === '=') {
                    lexema = '~/=';
                    contexto.avanzar(); contexto.avanzar(); contexto.avanzar();
                } else {
                    return null; 
                }
                break;

            case '<':
                if (charSiguiente === '<' && charSiguiente2 === '=') {
                    lexema = '<<=';
                    contexto.avanzar(); contexto.avanzar(); contexto.avanzar();
                } else {
                    return null; 
                }
                break;

            case '>':
                if (charSiguiente === '>' && charSiguiente2 === '=') {
                    lexema = '>>=';
                    contexto.avanzar(); contexto.avanzar(); contexto.avanzar();
                } else if (charSiguiente === '>' && charSiguiente2 === '>' && contexto.caracterSiguienteSiguienteSiguiente() === '=') {
                    lexema = '>>>=';
                    contexto.avanzar(); contexto.avanzar(); contexto.avanzar(); contexto.avanzar();
                } else {
                    return null; 
                }
                break;
            
            case ':':
                lexema = ':';
                contexto.avanzar(); 
                break;

            default:
                return null;
        }

        return new Token(lexema, categoria, inicio);
    }
}