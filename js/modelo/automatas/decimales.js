import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerDecimal {
    
    // Autómata 2
    ejecutar(contexto) {
        const inicio = contexto.indice;
        let lexema = "";

        if (!contexto.esDigito(contexto.caracterActual())) {
            return null;
        }

        while (contexto.esDigito(contexto.caracterActual())) {
            lexema += contexto.caracterActual();
            contexto.avanzar();
        }

        if (contexto.caracterActual() === '.' && contexto.esDigito(contexto.caracterSiguiente())) {
            lexema += contexto.caracterActual(); 
            contexto.avanzar();

            while (contexto.esDigito(contexto.caracterActual())) {
                lexema += contexto.caracterActual();
                contexto.avanzar();
            }

            return new Token(lexema, Categoria.NUMERO_DECIMAL, inicio);
        } else {
            contexto.indice = inicio;
            return null;
        }
    }
}