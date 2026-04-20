// Atrapamos el formulario para poder controlarlo
const formulario = document.getElementById('formulario-producto');

// Escuchamos el evento cuando le pican "Enviar"
formulario.addEventListener('submit', function(evento) {
    
    // Evitamos que la página se recargue inmediatamente
    evento.preventDefault(); 

    // Sacamos los valores que escribió el usuario
    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const categoria = document.getElementById('categoria').value;
    const ganancia = parseFloat(document.getElementById('ganancia').value);

    // --- EMPIEZAN LAS VALIDACIONES ---

    // 1. Validar longitud del nombre (Máximo 20)
    if (nombre.length > 20) {
        alert("El nombre no puede tener más de 20 caracteres.");
        return; // El return detiene el proceso si hay error
    }

    // 2. Validar precio (Máximo 2000)
    if (precio > 2000) {
        alert("El precio de venta no puede sobrepasar los $2000 pesos.");
        return;
    }

    // 3. Validar cantidad (Máximo 100)
    if (cantidad > 100) {
        alert("La cantidad en stock no puede ser mayor a 100.");
        return;
    }

    // 4. Validar categoría (Máximo 10 caracteres)
    if (categoria.length > 10) {
        alert("La categoría no puede tener más de 10 caracteres.");
        return;
    }

    // 5. Validar ganancia (Máximo 2000)
    if (ganancia > 2000) {
        alert("La ganancia no puede sobrepasar los $2000 pesos.");
        return;
    }

    // Si pasa todas las validaciones sin atorarse, mostramos éxito
    alert("¡Producto registrado con éxito en el inventario!");
    
    // Limpiamos el formulario para el siguiente registro
    formulario.reset();
});