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
                fila.classList.add('bg-red-100', 'text-red-800');
            } else if (token.categoria === Categoria.OPERADOR_COMPARACION) {
                fila.classList.add('bg-blue-100', 'text-blue-800', 'font-medium');
            }
            else if (token.categoria === Categoria.OPERADOR_LOGICO) {
                fila.classList.add('bg-green-100', 'text-green-800', 'font-medium');
            }
            
            fila.innerHTML = `
                <td>${token.lexema}</td>
                <td>${token.categoria}</td>
                <td>${token.posicion}</td>
            `;
            cuerpoTabla.appendChild(fila);
        });
    };
});