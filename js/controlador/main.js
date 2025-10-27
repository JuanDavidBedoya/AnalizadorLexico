import { AnalizadorLexico } from '../modelo/AnalizadorLexico.js';
import { Categoria } from '../modelo/Categorias.js';

document.addEventListener('DOMContentLoaded', () => {

    const btnAnalizar = document.getElementById('btnAnalizar');
    const codigoFuenteEl = document.getElementById('codigoFuente');
    const cuerpoTabla = document.getElementById('cuerpoTabla');

    btnAnalizar.onclick = () => {

        // 1. Limpiar la tabla de resultados anteriores
        cuerpoTabla.innerHTML = '';

        // 2. Obtener el texto del textarea
        const texto = codigoFuenteEl.value;
        if (!texto) {
            alert('Por favor, ingrese código para analizar.');
            return;
        }

        // 3. Crear una instancia del analizador
        const analizador = new AnalizadorLexico(texto);

        // 4. Llamar al método principal
        const tokens = analizador.analizar();

        // 5. Mostrar los resultados en la tabla
        if (tokens.length === 0) {

            cuerpoTabla.innerHTML = '<tr><td colspan="3">No se encontraron tokens.</td></tr>';
            return;

        }

        tokens.forEach(token => {
            const fila = document.createElement('tr');

            if (token.categoria.startsWith('Error:')) {
                fila.classList.add('bg-red-200', 'text-red-800');
            }else if (token.categoria === Categoria.OPERADOR_COMPARACION) {
                fila.classList.add('bg-blue-200', 'text-blue-800', 'font-medium');
            }else if (token.categoria === Categoria.OPERADOR_LOGICO) {
                fila.classList.add('bg-green-200', 'text-green-800', 'font-medium');
            }else if (token.categoria === Categoria.OPERADOR_ASIGNACION) {
                fila.classList.add('bg-orange-200', 'text-orange-800', 'font-medium');
            }else if (token.categoria === Categoria.OPERADOR_INCREMENTO_DECREMENTO){
                fila.classList.add('bg-indigo-200', 'text-indigo-800', 'font-medium');
            }else if (token.categoria === Categoria.PARENTESIS_APERTURA ||
                       token.categoria === Categoria.PARENTESIS_CIERRE) {
                fila.classList.add('bg-cyan-200', 'text-cyan-800', 'font-medium');
            }else if (token.categoria === Categoria.LLAVE_APERTURA ||
                     token.categoria === Categoria.LLAVE_CIERRE) {
                fila.classList.add('bg-gray-200', 'text-gray-800', 'font-medium');
            }else if (token.categoria === Categoria.TERMINAL) {
                fila.classList.add('bg-lime-200', 'text-lime-800', 'font-medium');
            }else if (token.categoria === Categoria.SEPARADOR) {
                fila.classList.add('bg-pink-200', 'text-pink-800', 'font-medium');
            }else if (token.categoria === Categoria.CADENA_CARACTERES) {
                fila.classList.add('bg-yellow-200', 'text-yellow-800', 'font-medium');
            }else if (token.categoria === Categoria.COMENTARIO_LINEA ||
                       token.categoria === Categoria.COMENTARIO_BLOQUE) {
                fila.classList.add('bg-teal-200', 'text-teal-800', 'font-medium'); 
            }else if (token.categoria === Categoria.NUMERO_ENTERO) {
                fila.classList.add('bg-purple-200', 'text-purple-800', 'font-medium');
            }
            

            let lexemaParaMostrar = token.lexema;
            
            fila.innerHTML = `
                <td>${token.lexema}</td>
                <td>${token.categoria}</td>
                <td>${token.posicion}</td>
            `;
            cuerpoTabla.appendChild(fila);
        });
    };
});