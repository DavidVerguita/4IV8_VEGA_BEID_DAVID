// ============================================================
// PRÁCTICA 3 - PNT: Frontend para Sistema de Compras
// ============================================================
// Este frontend maneja 3 secciones: Usuarios, Productos, Compras.
// Cada sección tiene su propio formulario y tabla.
//
// ESTRUCTURA DEL CÓDIGO:
// 1. Utilidades compartidas (fetchAPI, notificaciones, etc.)
// 2. Módulo de Usuarios (CRUD)
// 3. Módulo de Productos (CRUD)
// 4. Módulo de Compras (crear, listar, eliminar)
// 5. Navegación por pestañas
// 6. Inicialización
//
// EVOLUCIÓN DESDE P2:
// - Múltiples recursos (no solo usuarios)
// - Selects dinámicos (llenar opciones desde la API)
// - Navegación por pestañas sin recargar página (SPA-like)
// ============================================================

// ============================================================
// 1. UTILIDADES COMPARTIDAS
// ============================================================
// Mostrar/Ocultar input de "Otro item" en Jefes
const selectItem = document.getElementById('jefe-item');
const inputItemOtro = document.getElementById('jefe-item-otro');

if (selectItem) {
    selectItem.addEventListener('change', function() {
        if (this.value === 'otro') {
            inputItemOtro.style.display = 'block';
            inputItemOtro.required = true; // Lo hace obligatorio si elige "Otro"
        } else {
            inputItemOtro.style.display = 'none';
            inputItemOtro.required = false;
            inputItemOtro.value = ''; // Lo limpia si se arrepiente
        }
    });
}
// Panel de estado de la API
const apiMetodo = document.getElementById('api-metodo');
const apiUrl = document.getElementById('api-url');
const apiCodigo = document.getElementById('api-codigo');
const notificacionDiv = document.getElementById('notificacion');
const nivel_recomendado = document.getElementById('zona-nivel').value;

// Fetch wrapper con logging (evolución de P2)
async function fetchAPI(url, opciones = {}) {
    const method = opciones.method || 'GET';

    apiMetodo.textContent = method;
    apiMetodo.className = `badge badge-${method.toLowerCase()}`;
    apiUrl.textContent = url;
    apiCodigo.textContent = '...';
    apiCodigo.className = 'badge badge-neutral';

    try {
        const respuesta = await fetch(url, opciones);
        apiCodigo.textContent = `${respuesta.status}`;
        apiCodigo.className = `badge ${respuesta.ok ? 'badge-success' : 'badge-error'}`;

        const datos = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(datos.message || `Error ${respuesta.status}`);
        }
        return datos;
    } catch (error) {
        if (apiCodigo.textContent === '...') {
            apiCodigo.textContent = 'ERROR';
            apiCodigo.className = 'badge badge-error';
        }
        throw error;
    }
}

function mostrarNotificacion(mensaje, tipo) {
    notificacionDiv.textContent = mensaje;
    notificacionDiv.className = `notificacion ${tipo}`;
    notificacionDiv.style.display = 'block';
    setTimeout(() => { notificacionDiv.style.display = 'none'; }, 3000);
}

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function formatearFechaHora(fechaISO) {
    if (!fechaISO) return '-';
    return new Date(fechaISO).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// ============================================================
// 2. MÓDULO DE USUARIOS
// ============================================================
const formUsuario = document.getElementById('form-usuario');
const inputUsuarioId = document.getElementById('usuario-id');
const inputUsuarioNombre = document.getElementById('usuario-nombre');
const inputUsuarioEmail = document.getElementById('usuario-email');
const formTituloUsuario = document.getElementById('form-titulo-usuario');
const btnGuardarUsuario = document.getElementById('btn-guardar-usuario');
const btnCancelarUsuario = document.getElementById('btn-cancelar-usuario');
const tbodyUsuarios = document.getElementById('tbody-usuarios');
const tablaUsuarios = document.getElementById('tabla-usuarios');
const cargaUsuarios = document.getElementById('carga-usuarios');
const contadorUsuarios = document.getElementById('contador-usuarios');
const errorUsuarioNombre = document.getElementById('error-usuario-nombre');
const errorUsuarioEmail = document.getElementById('error-usuario-email');

async function cargarUsuarios() {
    try {
        const resp = await fetchAPI('/api/usuarios');
        cargaUsuarios.style.display = 'none';

        if (resp.data.length === 0) {
            tablaUsuarios.style.display = 'none';
            cargaUsuarios.textContent = 'No hay usuarios registrados.';
            cargaUsuarios.style.display = 'block';
        } else {
            tablaUsuarios.style.display = 'table';
            tbodyUsuarios.innerHTML = '';
            resp.data.forEach(u => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${u.id}</td>
                    <td>${escapeHtml(u.nombre)}</td>
                    <td>${escapeHtml(u.email)}</td>
                    <td>
                        <button class="btn-ver" onclick="verComprasUsuario(${u.id})">Compras</button>
                        <button class="btn-editar" onclick="editarUsuario(${u.id})">Editar</button>
                        <button class="btn-eliminar" onclick="confirmarEliminarUsuario(${u.id}, '${escapeHtml(u.nombre)}')">Eliminar</button>
                    </td>
                `;
                tbodyUsuarios.appendChild(fila);
            });
        }
        contadorUsuarios.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar usuarios: ' + error.message, 'error');
    }
}

function validarFormUsuario() {
    let ok = true;
    const nombre = inputUsuarioNombre.value.trim();
    const email = inputUsuarioEmail.value.trim();

    if (!nombre || nombre.length < 2) {
        errorUsuarioNombre.textContent = 'Mínimo 2 caracteres';
        inputUsuarioNombre.classList.add('input-error');
        ok = false;
    } else {
        errorUsuarioNombre.textContent = '';
        inputUsuarioNombre.classList.remove('input-error');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorUsuarioEmail.textContent = 'Email no válido';
        inputUsuarioEmail.classList.add('input-error');
        ok = false;
    } else {
        errorUsuarioEmail.textContent = '';
        inputUsuarioEmail.classList.remove('input-error');
    }

    return ok;
}

function limpiarFormUsuario() {
    formUsuario.reset();
    inputUsuarioId.value = '';
    formTituloUsuario.textContent = 'Agregar Usuario';
    btnGuardarUsuario.textContent = 'Guardar';
    btnCancelarUsuario.style.display = 'none';
    errorUsuarioNombre.textContent = '';
    errorUsuarioEmail.textContent = '';
    inputUsuarioNombre.classList.remove('input-error');
    inputUsuarioEmail.classList.remove('input-error');
}

formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormUsuario()) return;

    const datos = {
        nombre: inputUsuarioNombre.value.trim(),
        email: inputUsuarioEmail.value.trim()
    };
    const id = inputUsuarioId.value;

    try {
        if (id) {
            await fetchAPI(`/api/usuarios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Usuario actualizado', 'exito');
        } else {
            await fetchAPI('/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Usuario creado', 'exito');
        }
        limpiarFormUsuario();
        cargarUsuarios();
        cargarSelectUsuarios(); // Actualizar select de compras
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

async function editarUsuario(id) {
    try {
        const resp = await fetchAPI(`/api/usuarios/${id}`);
        inputUsuarioId.value = resp.data.id;
        inputUsuarioNombre.value = resp.data.nombre;
        inputUsuarioEmail.value = resp.data.email;
        formTituloUsuario.textContent = 'Editar Usuario';
        btnGuardarUsuario.textContent = 'Actualizar';
        btnCancelarUsuario.style.display = 'inline-block';
        cambiarSeccion('usuarios');
        formUsuario.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarUsuario(id, nombre) {
    if (confirm(`¿Eliminar a "${nombre}" y todas sus compras?`)) {
        eliminarUsuario(id);
    }
}

async function eliminarUsuario(id) {
    try {
        await fetchAPI(`/api/usuarios/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Usuario eliminado', 'exito');
        if (inputUsuarioId.value === String(id)) limpiarFormUsuario();
        cargarUsuarios();
        cargarSelectUsuarios();
        cargarCompras();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

// Ver compras de un usuario específico
async function verComprasUsuario(id) {
    try {
        const resp = await fetchAPI(`/api/compras/usuario/${id}`);
        const { usuario, compras, total_compras, total_gastado } = resp.data;

        let mensaje = `${usuario.nombre} tiene ${total_compras} compra(s).\nTotal gastado: $${total_gastado}\n\n`;
        compras.forEach(c => {
            mensaje += `- ${c.producto} x${c.cantidad} = $${parseFloat(c.total).toFixed(2)}\n`;
        });

        alert(mensaje);
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

btnCancelarUsuario.addEventListener('click', limpiarFormUsuario);

// ============================================================
// 3. MÓDULO DE PRODUCTOS
// ============================================================
const formProducto = document.getElementById('form-producto');
const inputProductoId = document.getElementById('producto-id');
const inputProductoNombre = document.getElementById('producto-nombre');
const inputProductoPrecio = document.getElementById('producto-precio');
const formTituloProducto = document.getElementById('form-titulo-producto');
const btnGuardarProducto = document.getElementById('btn-guardar-producto');
const btnCancelarProducto = document.getElementById('btn-cancelar-producto');
const tbodyProductos = document.getElementById('tbody-productos');
const tablaProductos = document.getElementById('tabla-productos');
const cargaProductos = document.getElementById('carga-productos');
const contadorProductos = document.getElementById('contador-productos');
const errorProductoNombre = document.getElementById('error-producto-nombre');
const errorProductoPrecio = document.getElementById('error-producto-precio');

async function cargarProductos() {
    try {
        const resp = await fetchAPI('/api/productos');
        cargaProductos.style.display = 'none';

        if (resp.data.length === 0) {
            tablaProductos.style.display = 'none';
            cargaProductos.textContent = 'No hay productos registrados.';
            cargaProductos.style.display = 'block';
        } else {
            tablaProductos.style.display = 'table';
            tbodyProductos.innerHTML = '';
            resp.data.forEach(p => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${p.id}</td>
                    <td>${escapeHtml(p.nombre)}</td>
                    <td>$${parseFloat(p.precio).toFixed(2)}</td>
                    <td>
                        <button class="btn-editar" onclick="editarProducto(${p.id})">Editar</button>
                        <button class="btn-eliminar" onclick="confirmarEliminarProducto(${p.id}, '${escapeHtml(p.nombre)}')">Eliminar</button>
                    </td>
                `;
                tbodyProductos.appendChild(fila);
            });
        }
        contadorProductos.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar productos: ' + error.message, 'error');
    }
}

function validarFormProducto() {
    let ok = true;
    const nombre = inputProductoNombre.value.trim();
    const precio = inputProductoPrecio.value;

    if (!nombre || nombre.length < 2) {
        errorProductoNombre.textContent = 'Mínimo 2 caracteres';
        inputProductoNombre.classList.add('input-error');
        ok = false;
    } else {
        errorProductoNombre.textContent = '';
        inputProductoNombre.classList.remove('input-error');
    }

    if (!precio || parseFloat(precio) <= 0) {
        errorProductoPrecio.textContent = 'Precio debe ser mayor que 0';
        inputProductoPrecio.classList.add('input-error');
        ok = false;
    } else {
        errorProductoPrecio.textContent = '';
        inputProductoPrecio.classList.remove('input-error');
    }

    return ok;
}

function limpiarFormProducto() {
    formProducto.reset();
    inputProductoId.value = '';
    formTituloProducto.textContent = 'Agregar Producto';
    btnGuardarProducto.textContent = 'Guardar';
    btnCancelarProducto.style.display = 'none';
    errorProductoNombre.textContent = '';
    errorProductoPrecio.textContent = '';
    inputProductoNombre.classList.remove('input-error');
    inputProductoPrecio.classList.remove('input-error');
}

formProducto.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormProducto()) return;

    const datos = {
        nombre: inputProductoNombre.value.trim(),
        precio: parseFloat(inputProductoPrecio.value)
    };
    const id = inputProductoId.value;

    try {
        if (id) {
            await fetchAPI(`/api/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Producto actualizado', 'exito');
        } else {
            await fetchAPI('/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Producto creado', 'exito');
        }
        limpiarFormProducto();
        cargarProductos();
        cargarSelectProductos();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

async function editarProducto(id) {
    try {
        const resp = await fetchAPI(`/api/productos/${id}`);
        inputProductoId.value = resp.data.id;
        inputProductoNombre.value = resp.data.nombre;
        inputProductoPrecio.value = resp.data.precio;
        formTituloProducto.textContent = 'Editar Producto';
        btnGuardarProducto.textContent = 'Actualizar';
        btnCancelarProducto.style.display = 'inline-block';
        cambiarSeccion('productos');
        formProducto.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarProducto(id, nombre) {
    if (confirm(`¿Eliminar "${nombre}"?\nSi tiene compras asociadas, no se podrá eliminar.`)) {
        eliminarProducto(id);
    }
}

async function eliminarProducto(id) {
    try {
        await fetchAPI(`/api/productos/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Producto eliminado', 'exito');
        if (inputProductoId.value === String(id)) limpiarFormProducto();
        cargarProductos();
        cargarSelectProductos();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

btnCancelarProducto.addEventListener('click', limpiarFormProducto);

// ============================================================
// 4. MÓDULO DE COMPRAS
// ============================================================
const formCompra = document.getElementById('form-compra');
const selectUsuario = document.getElementById('compra-usuario');
const selectProducto = document.getElementById('compra-producto');
const inputCantidad = document.getElementById('compra-cantidad');
const tbodyCompras = document.getElementById('tbody-compras');
const tablaCompras = document.getElementById('tabla-compras');
const cargaCompras = document.getElementById('carga-compras');
const contadorCompras = document.getElementById('contador-compras');
const errorCompraUsuario = document.getElementById('error-compra-usuario');
const errorCompraProducto = document.getElementById('error-compra-producto');
const errorCompraCantidad = document.getElementById('error-compra-cantidad');

// Llenar el <select> de usuarios con datos de la API
// Los <select> se llenan dinámicamente cada vez que cambian
// los datos, para mantenerlos sincronizados con la BD.
async function cargarSelectUsuarios() {
    try {
        const resp = await fetchAPI('/api/usuarios');
        selectUsuario.innerHTML = '<option value="">-- Seleccionar usuario --</option>';
        resp.data.forEach(u => {
            // createElement es más seguro que innerHTML para datos dinámicos
            const option = document.createElement('option');
            option.value = u.id;
            option.textContent = `${u.nombre} (${u.email})`;
            selectUsuario.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando select usuarios:', error);
    }
}

async function cargarSelectProductos() {
    try {
        const resp = await fetchAPI('/api/productos');
        selectProducto.innerHTML = '<option value="">-- Seleccionar producto --</option>';
        resp.data.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `${p.nombre} — $${parseFloat(p.precio).toFixed(2)}`;
            selectProducto.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando select productos:', error);
    }
}

async function cargarCompras() {
    try {
        const resp = await fetchAPI('/api/compras');
        cargaCompras.style.display = 'none';

        if (resp.data.length === 0) {
            tablaCompras.style.display = 'none';
            cargaCompras.textContent = 'No hay compras registradas.';
            cargaCompras.style.display = 'block';
        } else {
            tablaCompras.style.display = 'table';
            tbodyCompras.innerHTML = '';
            resp.data.forEach(c => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${c.id}</td>
                    <td>${escapeHtml(c.usuario_nombre)}</td>
                    <td>${escapeHtml(c.producto_nombre)}</td>
                    <td>$${parseFloat(c.producto_precio).toFixed(2)}</td>
                    <td>${c.cantidad}</td>
                    <td><strong>$${parseFloat(c.total).toFixed(2)}</strong></td>
                    <td>${formatearFechaHora(c.fecha_compra)}</td>
                    <td>
                        <button class="btn-eliminar" onclick="confirmarEliminarCompra(${c.id})">Eliminar</button>
                    </td>
                `;
                tbodyCompras.appendChild(fila);
            });
        }
        contadorCompras.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar compras: ' + error.message, 'error');
    }
}

function validarFormCompra() {
    let ok = true;

    if (!selectUsuario.value) {
        errorCompraUsuario.textContent = 'Selecciona un usuario';
        selectUsuario.classList.add('input-error');
        ok = false;
    } else {
        errorCompraUsuario.textContent = '';
        selectUsuario.classList.remove('input-error');
    }

    if (!selectProducto.value) {
        errorCompraProducto.textContent = 'Selecciona un producto';
        selectProducto.classList.add('input-error');
        ok = false;
    } else {
        errorCompraProducto.textContent = '';
        selectProducto.classList.remove('input-error');
    }

    const cant = parseInt(inputCantidad.value);
    if (!cant || cant < 1) {
        errorCompraCantidad.textContent = 'Mínimo 1';
        inputCantidad.classList.add('input-error');
        ok = false;
    } else {
        errorCompraCantidad.textContent = '';
        inputCantidad.classList.remove('input-error');
    }

    return ok;
}

formCompra.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormCompra()) return;

    // 1. Capturamos el texto visible de los selects antes de limpiar el formulario
    // .split() nos ayuda a limpiar el texto para que solo salga el nombre limpio (sin el email o el precio)
    const nombreUsuario = selectUsuario.options[selectUsuario.selectedIndex].text.split(' (')[0];
    const nombreProducto = selectProducto.options[selectProducto.selectedIndex].text.split(' — ')[0];

    try {
        const resp = await fetchAPI('/api/compras', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: parseInt(selectUsuario.value),
                producto_id: parseInt(selectProducto.value),
                cantidad: parseInt(inputCantidad.value)
            })
        });

        // 2. Usamos los nombres del Frontend y los números validados del Backend
        mostrarNotificacion(
            `Compra registrada: ${nombreUsuario} compró ${resp.data.cantidad}x ${nombreProducto} ($${parseFloat(resp.data.total).toFixed(2)})`,
            'exito'
        );
        
        formCompra.reset();
        inputCantidad.value = '1';
        cargarCompras();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

function confirmarEliminarCompra(id) {
    if (confirm('¿Eliminar esta compra?')) {
        eliminarCompra(id);
    }
}

async function eliminarCompra(id) {
    try {
        await fetchAPI(`/api/compras/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Compra eliminada', 'exito');
        cargarCompras();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

/// ============================================================
// MÓDULO EXTRA: ZONAS (DARK SOULS) - COMPLETO Y LIMPIO
// ============================================================
const formZona = document.getElementById('form-zona');
const tbodyZonas = document.getElementById('tbody-zonas');
const cargaZonasP = document.getElementById('carga-zonas');
const tablaZonas = document.getElementById('tabla-zonas');
const contadorZonas = document.getElementById('contador-zonas');

async function cargarZonas() {
    try {
        if (cargaZonasP) cargaZonasP.style.display = 'block';
        if (tablaZonas) tablaZonas.style.display = 'none';

        const respuesta = await fetchAPI('/api/zonas');
        
        if (respuesta && respuesta.status === 'success') {
            const zonas = respuesta.data;
            if (contadorZonas) contadorZonas.textContent = zonas.length;
            
            if (tbodyZonas) {
                tbodyZonas.innerHTML = '';
                
                if (zonas.length === 0) {
                    tbodyZonas.innerHTML = '<tr><td colspan="7" class="text-center">No hay zonas registradas</td></tr>';
                } else {
                    zonas.forEach(zona => {
                        const jefesLista = zona.jefes ? `<span class="badge badge-success">${zona.jefes}</span>` : '<em class="text-muted">Ninguno</em>';
                        
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td><strong>${zona.id}</strong></td>
                            <td>${zona.nombre}</td>
                            <td>SL ${zona.nivel_recomendado}</td>
                            <td>🔥 ${zona.total_hogueras}</td>
                            <td><span class="badge">${zona.dificultad.toUpperCase()}</span></td>
                            <td>${jefesLista}</td>
                            <td>
                                <button class="btn-tabla btn-editar" onclick="editarZona(${zona.id})">Editar</button>
                                <button class="btn-tabla btn-eliminar" onclick="eliminarZona(${zona.id})">Eliminar</button>
                            </td>
                        `;
                        tbodyZonas.appendChild(tr);
                    });
                }
            }

            if (cargaZonasP) cargaZonasP.style.display = 'none';
            if (tablaZonas) tablaZonas.style.display = 'table';
        }
    } catch (error) {
        mostrarNotificacion('Error al cargar las zonas', 'error');
    }
}

if (formZona) {
    formZona.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1. Limpiar errores previos de forma segura
        ['nombre', 'nivel', 'hogueras', 'dificultad'].forEach(campo => {
            const el = document.getElementById(`error-zona-${campo}`);
            if (el) el.textContent = '';
        });

        // 2. Capturar valores de forma segura 
        const idEl = document.getElementById('zona-id');
        const nombreEl = document.getElementById('zona-nombre');
        const nivelEl = document.getElementById('zona-nivel');
        const hoguerasEl = document.getElementById('zona-hogueras');
        const dificultadEl = document.getElementById('zona-dificultad');

        const id = idEl ? idEl.value : '';
        const nombre = nombreEl ? nombreEl.value : '';
        const nivel_recomendado = nivelEl ? nivelEl.value : '';
        const total_hogueras = hoguerasEl ? hoguerasEl.value : '';
        const dificultad = dificultadEl ? dificultadEl.value : '';

        // 3. Validaciones en Frontend
        let tieneErrores = false;

        if (!nombre || !nombre.trim()) {
            const el = document.getElementById('error-zona-nombre');
            if (el) el.textContent = 'El nombre es obligatorio';
            tieneErrores = true;
        }
        
        if (!nivel_recomendado || parseInt(nivel_recomendado) < 1 || parseInt(nivel_recomendado) > 100) {
            const el = document.getElementById('error-zona-nivel');
            if (el) el.textContent = 'Error: El nivel debe ser únicamente un número entre 1 y 100';
            tieneErrores = true;
        }
        
        if (total_hogueras === '' || parseInt(total_hogueras) < 0 || parseInt(total_hogueras) > 5) {
            const el = document.getElementById('error-zona-hogueras');
            if (el) el.textContent = 'Error: No puedes exceder el límite de 5 hogueras por zona';
            tieneErrores = true;
        }
        
        if (!dificultad) {
            const el = document.getElementById('error-zona-dificultad');
            if (el) el.textContent = 'Selecciona una dificultad';
            tieneErrores = true;
        }

        // Si hay errores en pantalla, nos detenemos aquí
        if (tieneErrores) return;

        // 4. Armar el JSON de envío
        const datos = { 
            nombre, 
            nivel_recomendado: parseInt(nivel_recomendado), 
            total_hogueras: parseInt(total_hogueras), 
            dificultad 
        };
        
        const url = id ? `/api/zonas/${id}` : '/api/zonas';
        const metodo = id ? 'PUT' : 'POST';

        // 5. Enviar al backend protegiendo contra caídas y añadiendo los headers correctos
        try {
            const respuesta = await fetchAPI(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' }, // <-- ¡CORREGIDO! Ahora Express sí leerá los datos
                body: JSON.stringify(datos)
            });

            if (respuesta && respuesta.status === 'success') {
                mostrarNotificacion(id ? 'Zona actualizada' : 'Zona guardada con éxito', 'success');
                resetearFormularioZona();
                cargarZonas();
            } else {
                mostrarNotificacion(respuesta.message || 'Error al guardar', 'error');
            }
        } catch (error) {
            // Captura el error si la API falla y lo muestra de forma elegante
            mostrarNotificacion(error.message, 'error');
        }
    });
}

async function editarZona(id) {
    const respuesta = await fetchAPI(`/api/zonas/${id}`);
    if (respuesta && respuesta.status === 'success') {
        const zona = respuesta.data;
        document.getElementById('zona-id').value = zona.id;
        document.getElementById('zona-nombre').value = zona.nombre;
        document.getElementById('zona-nivel').value = zona.nivel_recomendado;
        document.getElementById('zona-hogueras').value = zona.total_hogueras;
        document.getElementById('zona-dificultad').value = zona.dificultad;

        document.getElementById('form-titulo-zona').textContent = 'Editar Zona';
        document.getElementById('btn-guardar-zona').textContent = 'Actualizar';
        document.getElementById('btn-cancelar-zona').style.display = 'inline-block';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

async function eliminarZona(id) {
    if (confirm('¿Seguro que quieres eliminar esta zona?')) {
        const respuesta = await fetchAPI(`/api/zonas/${id}`, { method: 'DELETE' });
        if (respuesta && respuesta.status === 'success') {
            mostrarNotificacion('Zona eliminada con éxito', 'success');
            cargarZonas();
        } else {
            mostrarNotificacion(respuesta.message || 'Error al eliminar', 'error');
        }
    }
}

function resetearFormularioZona() {
    if (formZona) formZona.reset();
    document.getElementById('zona-id').value = '';
    document.getElementById('form-titulo-zona').textContent = 'Agregar Zona';
    document.getElementById('btn-guardar-zona').textContent = 'Guardar';
    document.getElementById('btn-cancelar-zona').style.display = 'none';
}

const btnCancelarZona = document.getElementById('btn-cancelar-zona');
if (btnCancelarZona) {
    btnCancelarZona.addEventListener('click', resetearFormularioZona);
}

// ============================================================
// MÓDULO: JEFES (DARK SOULS) - COMPLETAMENTE SINCRONIZADO
// ============================================================
const formJefe = document.getElementById('form-jefe');
const tbodyJefes = document.getElementById('tbody-jefes');
const cargaJefes = document.getElementById('carga-jefes');
const tablaJefes = document.getElementById('tabla-jefes');
const contadorJefes = document.getElementById('contador-jefes');
const selectJefeZona = document.getElementById('jefe-zona');

// Cargar el select del formulario de jefes con las zonas existentes en la BD
async function cargarSelectZonas() {
    try {
        const resp = await fetchAPI('/api/zonas');
        if (resp && resp.status === 'success' && selectJefeZona) {
            selectJefeZona.innerHTML = '<option value="">-- Seleccionar --</option>';
            resp.data.forEach(zona => {
                const option = document.createElement('option');
                option.value = zona.id;
                option.textContent = zona.nombre;
                selectJefeZona.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error cargando zonas en select:', error);
    }
}

// Listar los jefes en la tabla HTML
async function cargarJefes() {
    try {
        if (cargaJefes) cargaJefes.style.display = 'block';
        if (tablaJefes) tablaJefes.style.display = 'none';

        // Hacemos la petición a tu Backend de Node
        const resp = await fetchAPI('/api/jefes');
        
        if (resp && resp.status === 'success') {
            if (contadorJefes) contadorJefes.textContent = resp.count;
            if (tbodyJefes) {
                tbodyJefes.innerHTML = ''; // Limpiamos la tabla antes de pintar
                
                if (resp.data.length === 0) {
                    tbodyJefes.innerHTML = '<tr><td colspan="7" class="text-center">No hay jefes registrados en Lordran</td></tr>';
                } else {
                    
                    // Aquí recorremos cada jefe ("j") que trajo la base de datos
                    resp.data.forEach(j => {
                        const tr = document.createElement('tr');
                        
                        // ¡AQUÍ ES DONDE VA TU CÓDIGO EXACTAMENTE!
                        tr.innerHTML = `
                            <td><strong>${j.id}</strong></td>
                            <td>${escapeHtml(j.nombre)}</td>
                            <td><span class="badge badge-neutral">${escapeHtml(j.zona_nombre || 'Desconocida')}</span></td>
                            <td><span class="badge">${j.dificultad.toUpperCase()}</span></td>
                            <td>SL ${j.nivel_recomendado}</td>
                            <td>${j.item_recomendado ? escapeHtml(j.item_recomendado) : '<em class="text-muted">Ninguno</em>'}</td>
                            <td>
                                <button class="btn-tabla btn-editar" onclick="editarJefe(${j.id})">Editar</button>
                                <button class="btn-tabla btn-eliminar" onclick="eliminarJefe(${j.id})">Eliminar</button>
                            </td>
                        `;
                        
                        // Metemos la fila armada dentro del cuerpo de la tabla HTML
                        tbodyJefes.appendChild(tr);
                    });

                }
            }
            if (cargaJefes) cargaJefes.style.display = 'none';
            if (tablaJefes) tablaJefes.style.display = 'table';
        }
    } catch (error) {
        mostrarNotificacion('Error al cargar jefes: ' + error.message, 'error');
    }
}

// Escuchador del formulario para Crear o Editar un Jefe
if (formJefe) {
    formJefe.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Limpiar errores visuales previos
        ['nombre', 'zona', 'dificultad', 'nivel'].forEach(c => {
            const el = document.getElementById(`error-jefe-${c}`);
            if (el) el.textContent = '';
        });

        const id = document.getElementById('jefe-id').value;
        const nombre = document.getElementById('jefe-nombre').value.trim();
        const zona_id = document.getElementById('jefe-zona').value;
        const dificultad = document.getElementById('jefe-dificultad').value;
        const nivel_recomendado = document.getElementById('jefe-nivel').value;
let item_recomendado = document.getElementById('jefe-item').value;
        // Si eligió "otro", tomamos lo que haya escrito en el input de texto
        if (item_recomendado === 'otro') {
            item_recomendado = document.getElementById('jefe-item-otro').value;
        }
        let validado = true;

        if (!nombre) {
            document.getElementById('error-jefe-nombre').textContent = 'El nombre es obligatorio';
            validado = false;
        }
        if (!zona_id) {
            document.getElementById('error-jefe-zona').textContent = 'Selecciona una zona';
            validado = false;
        }
        if (!dificultad) {
            document.getElementById('error-jefe-dificultad').textContent = 'Selecciona la dificultad';
            validado = false;
        }
        if (!nivel_recomendado || parseInt(nivel_recomendado) < 1 || parseInt(nivel_recomendado) > 100) {
            document.getElementById('error-jefe-nivel').textContent = 'Error: El nivel del jefe está limitado a un máximo de 100';
            validado = false; 
        }

        if (!validado) return;

        const datos = {
    nombre: document.getElementById('jefe-nombre').value.trim(),
    zona_id: parseInt(document.getElementById('jefe-zona').value),
    dificultad: document.getElementById('jefe-dificultad').value,
    nivel_recomendado: parseInt(document.getElementById('jefe-nivel').value),
    item_recomendado: document.getElementById('jefe-item').value.trim()
};

        try {
            const url = id ? `/api/jefes/${id}` : '/api/jefes';
            const method = id ? 'PUT' : 'POST';

            const resp = await fetchAPI(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (resp && resp.status === 'success') {
                mostrarNotificacion(id ? '¡Jefe actualizado!' : '¡Jefe registrado exitosamente!', 'success');
                resetearFormularioJefe();
                cargarJefes();
            }
        } catch (error) {
            mostrarNotificacion(error.message, 'error');
        }
    });
}

async function editarJefe(id) {
    try {
        const resp = await fetchAPI(`/api/jefes/${id}`);
        if (resp && resp.status === 'success') {
            const j = resp.data;
            document.getElementById('jefe-id').value = j.id;
            document.getElementById('jefe-nombre').value = j.nombre;
            document.getElementById('jefe-zona').value = j.zona_id;
            document.getElementById('jefe-dificultad').value = j.dificultad;
            document.getElementById('jefe-nivel').value = j.nivel_recomendado;

            // Lógica para rellenar el select o el input personalizado
            if (j.item_recomendado) {
                // Verificamos si el item de la BD está en nuestro catálogo
                const opcionesSelect = Array.from(document.getElementById('jefe-item').options).map(opt => opt.value);
                
                if (opcionesSelect.includes(j.item_recomendado)) {
                    // Si está en el catálogo, lo seleccionamos normal
                    document.getElementById('jefe-item').value = j.item_recomendado;
                    document.getElementById('jefe-item-otro').style.display = 'none';
                } else {
                    // Si no está (es uno personalizado), marcamos "Otro..." y mostramos el texto
                    document.getElementById('jefe-item').value = 'otro';
                    document.getElementById('jefe-item-otro').style.display = 'block';
                    document.getElementById('jefe-item-otro').value = j.item_recomendado;
                }
            } else {
                document.getElementById('jefe-item').value = '';
                document.getElementById('jefe-item-otro').style.display = 'none';
            }

            document.getElementById('form-titulo-jefe').textContent = 'Editar Jefe';
            document.getElementById('btn-guardar-jefe').textContent = 'Actualizar';
            document.getElementById('btn-cancelar-jefe').style.display = 'inline-block';

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

async function eliminarJefe(id) {
    if (confirm('¿Deseas desterrar a este jefe del mundo de juego?')) {
        try {
            const resp = await fetchAPI(`/api/jefes/${id}`, { method: 'DELETE' });
            if (resp && resp.status === 'success') {
                mostrarNotificacion('Jefe eliminado correctamente', 'success');
                cargarJefes();
            }
        } catch (error) {
            mostrarNotificacion(error.message, 'error');
        }
    }
}

function resetearFormularioJefe() {
    if (formJefe) formJefe.reset();
    document.getElementById('jefe-id').value = '';
    document.getElementById('form-titulo-jefe').textContent = 'Agregar Jefe';
    document.getElementById('btn-guardar-jefe').textContent = 'Guardar';
    document.getElementById('btn-cancelar-jefe').style.display = 'none';
}

const btnCancelarJefe = document.getElementById('btn-cancelar-jefe');
if (btnCancelarJefe) btnCancelarJefe.addEventListener('click', resetearFormularioJefe);
// ============================================================
// 5. NAVEGACIÓN POR PESTAÑAS
// ============================================================
// Esta función muestra una sección y oculta las demás.
// También actualiza la pestaña activa visualmente.
// Es un patrón básico de SPA (Single Page Application):
// cambiar contenido sin recargar la página.
function cambiarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.seccion').forEach(s => {
        s.style.display = 'none';
    });

    // Desactivar todas las pestañas
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    document.getElementById(`seccion-${seccion}`).style.display = 'block';

    // Activar la pestaña correspondiente
    // Array.from convierte NodeList a Array para poder usar find()
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const tabActiva = tabs.find(t => t.textContent.toLowerCase() === seccion);
    if (tabActiva) tabActiva.classList.add('active');

    // Si cambiamos a compras, recargar selects con datos actuales
    if (seccion === 'compras') {
        cargarSelectUsuarios();
        cargarSelectProductos();
        cargarCompras();
    }

    if (seccion === 'zonas') {
        cargarZonas();
    }
    if (seccion === 'jefes') {
        cargarSelectZonas();
        cargarJefes();
    }
}


// ============================================================
// 6. INICIALIZACIÓN
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
    cargarProductos();
    cargarCompras();
    cargarZonas(); // <-- ¡AGREGA ESTA LÍNEA!
    cargarJefes();
    cargarSelectUsuarios();
    cargarSelectProductos();
    cargarSelectZonas();
});