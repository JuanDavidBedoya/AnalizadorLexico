import { Token } from '../Token.js';
import { Categoria } from '../Categorias.js';

export class extraerPalabraReservada {
    
    // Autómata 4
    ejecutar(contexto) {
        const inicio = contexto.indice;
        let lexema = '';

        const palabrasReservadas = [

        'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return', 'yield', 'await', 'async', 'try', 'catch', 'throw', 'finally',

        'class', 'enum', 'mixin', 'extends', 'implements', 'with', 'abstract', 'interface', 'typedef', 'import', 'export', 'library', 'part', 'of',

        'var', 'final', 'const', 'late', 'static', 'dynamic', 'void', 'null', 'true', 'false', 'this', 'super', 'new',

        'int', 'double', 'num', 'bool', 'String', 'List', 'Map', 'Set', 'Object', 'Future', 'Stream',

        'operator', 'get', 'set', 'required', 'covariant', 'external', 'factory', 'assert', 'in', 'is', 'as', 'on', 'show', 'hide',

        'deferred', 'rethrow', 'sync'
        ];

        const charInicial = contexto.caracterActual();
        if (!contexto.esLetra(charInicial)) {
            return null;
        }

        lexema += charInicial;
        contexto.avanzar();

        while (
            contexto.caracterActual() !== null &&
            (contexto.esLetra(contexto.caracterActual()) || contexto.esDigito(contexto.caracterActual()))
        ) {
            lexema += contexto.caracterActual();
            contexto.avanzar();
        }

        if (palabrasReservadas.includes(lexema)) {
            return new Token(lexema, Categoria.PALABRA_RESERVADA, inicio);
        }

        contexto.indice = inicio; 
        return null;
    }
}