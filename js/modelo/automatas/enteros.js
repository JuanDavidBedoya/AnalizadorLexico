import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerEntero{

// Autómata 1   
    ejecutar(contexto) {
        const inicio = contexto.indice;
        let lexema = '';
        const categoria = Categoria.NUMERO_ENTERO;

        if (!contexto.esDigito(contexto.caracterActual())) {
            contexto.indice = inicio;
            return null;
        }

        while (contexto.esDigito(contexto.caracterActual())) {
            lexema += contexto.caracterActual();
            contexto.avanzar();
        }

        return new Token(lexema, categoria, inicio);
    }
}