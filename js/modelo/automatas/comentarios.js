import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerComentarios {    
    //Autómata 15
    ejecutar(contexto) {
        const charActual = contexto.caracterActual();
        const charSiguiente = contexto.caracterSiguiente();
        const charSiguiente2 = contexto.caracterSiguienteSiguiente();
        const posicionInicial = contexto.indice;

        if (charActual === '/') {
            if (charSiguiente === '/') {
                
                let categoria = Categoria.COMENTARIO_LINEA;
                let lexemaInicial = '//';

                if (charSiguiente2 === '/') {
                    categoria = Categoria.COMENTARIO_DOCUMENTACION; 
                    lexemaInicial = '///';
                    contexto.avanzar();
                }

                contexto.avanzar(); contexto.avanzar(); 

                let lexema = lexemaInicial;
                while (contexto.indice < contexto.codigoFuente.length && contexto.caracterActual() !== '\n' && contexto.caracterActual() !== '\r') {
                    lexema += contexto.caracterActual();
                    contexto.avanzar();
                }
                return new Token(lexema, categoria, posicionInicial);

            } else if (charSiguiente === '*') {
                contexto.avanzar(); contexto.avanzar();
                let lexema = '/*';
                let encontradoCierre = false;

                while (contexto.indice < contexto.codigoFuente.length) {
                    const char = contexto.caracterActual();
                    const nextChar = contexto.caracterSiguiente();

                    if (char === '*' && nextChar === '/') {
                        lexema += '*/';
                        contexto.avanzar(); contexto.avanzar();
                        encontradoCierre = true;
                        break;
                    }

                    lexema += char;
                    contexto.avanzar();
                }

                if (encontradoCierre) {
                    return new Token(lexema, Categoria.COMENTARIO_BLOQUE, posicionInicial);
                } else {
                    return new Token(lexema, Categoria.ERROR_BLOQUE_SIN_CERRAR, posicionInicial);
                }
            }
        }

        return null;
    }
}