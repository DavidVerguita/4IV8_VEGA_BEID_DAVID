
// 1. Parámetros del formulario obtenidos del HTML
const formUsuario = document.getElementById('form-usuario');
const inputId = document.getElementById('usuario-id');
const inputNombre = document.getElementById('nombre');
const inputFecha = document.getElementById('fecha_nacimiento');
const inputNota = document.getElementById('nota');
const formTitulo = document.getElementById('form-titulo');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');
const tbodyUsuarios = document.getElementById('tbody-usuarios');
const tablaUsuarios = document.getElementById('tabla-usuarios');
const mensajeCargar = document.getElementById('mensaje-carga');
const mensajeVacio = document.getElementById('mensaje-vacio');
const notificacionDiv = document.getElementById('notificacion');

// Elementos para errores (Corregido el "document" y el punto)
const errorNombre = document.getElementById('error-nombre');
const errorFecha = document.getElementById('error-fecha');
const errorNota = document.getElementById('error-nota');

// URL de la API del servidor
const API_URL = '/api/usuarios';

// 2. Función para cargar usuarios desde el Servidor (MySQL)
async function cargarUsuarios() {
    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error('Error al cargar usuarios desde el servidor');
        }

        const usuarios = await respuesta.json();
        renderizarTabla(usuarios);

    } catch (error) {
        console.error('Error detectado en el Frontend:', error);
    }
}

// 3. Función para dibujar las filas en la tabla HTML
function renderizarTabla(usuarios) {
    tbodyUsuarios.innerHTML = '';

    if (usuarios.length === 0) {
        mensajeCargar.style.display = 'none';
        mensajeVacio.style.display = 'block';
        tablaUsuarios.style.display = 'none';
        return;
    }

    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.fecha_nacimiento.substring(0, 10)}</td>
            <td>${usuario.nota}</td>
            <td>
                <button class="btn-editar" style="background:#e67e22; color:white; border:none; padding:5px 10px; cursor:pointer;">Editar</button>
                <button class="btn-eliminar" style="background:#e74c3c; color:white; border:none; padding:5px 10px; cursor:pointer;">Eliminar</button>
            </td>
        `;
        tbodyUsuarios.appendChild(tr);
    });

    mensajeCargar.style.display = 'none';
    mensajeVacio.style.display = 'none';
    tablaUsuarios.style.display = 'table';
}

// 4. Escuchar el envío del formulario para guardar datos
formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoUsuario = {
        nombre: inputNombre.value,
        fecha_nacimiento: inputFecha.value,
        nota: parseFloat(inputNota.value)
    };

    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoUsuario)
        });

        if (!respuesta.ok) {
            throw new Error('Error al registrar el usuario');
        }

        formUsuario.reset();
        await cargarUsuarios(); // Recargar la tabla automáticamente

    } catch (error) {
        console.error('Error al guardar:', error);
    }
});

// 5. Ejecutar la carga de datos automáticamente al abrir la página
cargarUsuarios();