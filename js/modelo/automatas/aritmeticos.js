import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerOperadorAritmetico {   
    
    // Autómata 5
    ejecutar(contexto) {
        const inicio = contexto.indice;
        const char = contexto.caracterActual();

        const operadoresSimples = ['+', '-', '*', '/', '%'];

        const siguiente = contexto.caracterSiguiente();
        if ((char === '~' && siguiente === '/')) {
            const lexema = char + siguiente;
            contexto.avanzar(); 
            contexto.avanzar();
            return new Token(lexema, Categoria.OPERADOR_ARITMETICO, inicio);
        }

        if (operadoresSimples.includes(char)) {
            contexto.avanzar();
            return new Token(char, Categoria.OPERADOR_ARITMETICO, inicio);
        }

        return null; 
    }
}