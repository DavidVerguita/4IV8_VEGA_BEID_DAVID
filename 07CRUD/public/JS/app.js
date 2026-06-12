// Obtención de referencias del DOM del formulario
const formUsuario = document.getElementById('form-usuario');
const inputId = document.getElementById('id-usuario'); 
const inputNombre = document.getElementById('nombre');
const inputFecha = document.getElementById('fecha_nacimiento');
const inputNota = document.getElementById('nota');
const formTitulo = document.getElementById('form-titulo');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');

// Referencias de elementos de visualización de tablas
const tbodyUsuarios = document.getElementById('tbody-usuarios');
const tablaUsuarios = document.getElementById('tabla-usuarios');
const mensajeCarga = document.getElementById('mensaje-carga'); // Variable base
const mensajeVacio = document.getElementById('mensaje-vacio');
const notificacionDiv = document.getElementById('notificacion');

// Elementos para el manejo visual de errores
const errorNombre = document.getElementById('error-nombre');
const errorFecha = document.getElementById('error-fecha');
const errorNota = document.getElementById('error-nota'); 

// Endpoint de la API REST de Node.js
const API_URL = '/api/usuarios';

// Validar si estamos en GitHub Pages o de forma local
const esGitHubPages = window.location.hostname.includes('github.io');

// Carga inicial de usuarios al abrir la página
document.addEventListener('DOMContentLoaded', cargarUsuarios);

async function cargarUsuarios() {
    try {
        // Si está en GitHub Pages, no intentará colgarse llamando a un backend inexistente
        if (esGitHubPages) {
            mensajeCarga.style.display = 'none'; // CORREGIDO: Sincronizado con mensajeCarga
            mensajeVacio.textContent = " [Entorno de Servidor Inactivo en GitHub Pages] Para conectar con MySQL, ejecuta 'node server.js' localmente.";
            mensajeVacio.style.display = 'block';
            return;
        }

        const respuesta = await fetch(API_URL);
        if(!respuesta.ok) throw new Error('Error al cargar usuarios');

        const usuarios = await respuesta.json();
        renderizarTabla(usuarios);

    } catch (error) {
        console.log('Error: ', error);
        mensajeCarga.style.display = 'none'; // CORREGIDO: Sincronizado con mensajeCarga
        mensajeVacio.textContent = "Error de enlace con el servidor místico.";
        mensajeVacio.style.display = 'block';
    }
}

// Envío del formulario (Unificado en un solo evento controlado)
formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // CONTROL DE PARACAÍDAS PARA GITHUB PAGES
    if (esGitHubPages) {
        mostrarNotificacion('Las peticiones HTTP al servidor no están disponibles en GitHub Pages.', 'error');
        return; 
    }

    limpiarErrores();

    const id = inputId.value;
    const datos = {
        nombre: inputNombre.value.trim(),
        fecha_nacimiento: inputFecha.value,
        nota: parseFloat(inputNota.value)
    };

    const esEdicion = id !== '';
    const url = esEdicion ? `${API_URL}/${id}` : API_URL;
    const method = esEdicion ? 'PUT' : 'POST';

    try {
        const respuesta = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) throw new Error('Fallo en la operación de guardado.');

        mostrarNotificacion(esEdicion ? 'Usuario actualizado con éxito.' : 'Usuario registrado correctamente.', 'exito');
        restablecerFormulario();
        cargarUsuarios();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al procesar la solicitud.', 'error');
    }
});

function renderizarTabla(usuarios) {
    tbodyUsuarios.innerHTML = '';
    
    if (usuarios.length === 0) {
        tablaUsuarios.style.display = 'none';
        mensajeVacio.style.display = 'block';
        return;
    }

    mensajeVacio.style.display = 'none';
    tablaUsuarios.style.display = 'table';

    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        
        // Formatear la fecha de ISO a formato local legible
        const fecha = new Date(usuario.fecha_nacimiento);
        const fechaFormateada = !isNaN(fecha) ? fecha.toLocaleDateString('es-MX', { timeZone: 'UTC' }) : usuario.fecha_nacimiento;

        tr.innerHTML = `
            <td>${usuario.id}</td>
            <td class="text-left">${usuario.nombre}</td>
            <td>${fechaFormateada}</td>
            <td><span class="badge-nota">${parseFloat(usuario.nota).toFixed(1)}</span></td>
            <td>
                <button class="btn-accion btn-editar" onclick="prepararEdicion(${usuario.id}, '${usuario.nombre}', '${usuario.fecha_nacimiento.split('T')[0]}', ${usuario.nota})">Editar</button>
                <button class="btn-accion btn-eliminar" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
            </td>
        `;
        tbodyUsuarios.appendChild(tr);
    });
}

function prepararEdicion(id, nombre, fecha, nota) {
    inputId.value = id;
    inputNombre.value = nombre;
    inputFecha.value = fecha;
    inputNota.value = nota;

    formTitulo.textContent = 'Modificar Registro #' + id;
    btnGuardar.textContent = 'Actualizar Datos';
    btnCancelar.style.display = 'inline-block';
    inputNombre.focus();
}

btnCancelar.addEventListener('click', restablecerFormulario);

function restablecerFormulario() {
    formUsuario.reset();
    inputId.value = '';
    formTitulo.textContent = 'Agregar Nuevo Usuario';
    btnGuardar.textContent = 'Guardar Destino';
    btnCancelar.style.display = 'none';
    limpiarErrores();
}

async function eliminarUsuario(id) {
    if (esGitHubPages) {
        mostrarNotificacion('Las peticiones HTTP al servidor no están disponibles en GitHub Pages.', 'error');
        return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar permanentemente este registro?')) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!respuesta.ok) throw new Error('No se pudo eliminar el registro.');

        mostrarNotificacion('Registro eliminado del sistema.', 'exito');
        if (inputId.value === id.toString()) restablecerFormulario();
        cargarUsuarios();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al intentar eliminar al usuario.', 'error');
    }
}

function limpiarErrores() {
    errorNombre.textContent = '';
    errorFecha.textContent = '';
    errorNota.textContent = '';
}

function mostrarNotificacion(mensaje, tipo) {
    notificacionDiv.textContent = mensaje;
    notificacionDiv.className = `notificacion ${tipo}`;
    notificacionDiv.style.display = 'block';
    
    setTimeout(() => {
        notificacionDiv.style.display = 'none';
    }, 4000);
}