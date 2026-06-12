const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3000;

// Configuración del Pool de conexiones a MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: 'pnt_practica1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Diccionario de Tipos MIME enriquecido para soportar el diseño completo
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

// Utilidad para extraer el cuerpo JSON de peticiones POST/PUT
function recibirJSON(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > 1e6) { 
                req.destroy();
                reject(new Error('Payload demasiado grande.'));
            }
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(new Error('Formato JSON inválido.'));
            }
        });
        req.on('error', reject);
    });
}

function enviarJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
}

// Servidor de archivos estáticos (HTML, CSS, JS)
function servirArchivoEstatico(req, res, pathname) {
    let rutaArchivo = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    let extension = path.extname(rutaArchivo);
    let contentType = MIME_TYPES[extension] || 'application/octet-stream';

    fs.readFile(rutaArchivo, (error, contenido) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('404 Recurso No Encontrado');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('500 Error Interno del Servidor');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(contenido, 'utf-8');
        }
    });
}

// Servidor de peticiones HTTP principal
const server = http.createServer(async (req, res) => {
    const parseUrl = url.parse(req.url, true);
    const pathname = parseUrl.pathname;
    const method = req.method;

    console.log(`[${new Date().toLocaleTimeString()}] ${method} ${pathname}`);

    // == ENTRADAS DE LA API REST CORREGIDAS ==
    if (pathname === '/api/usuarios' && method === 'GET') {
        pool.query('SELECT id, nombre, fecha_nacimiento, nota FROM usuarios ORDER BY id DESC', (err, resultados) => {
            if (err) return enviarJSON(res, 500, { error: 'Error al consultar la Base de Datos.' });
            enviarJSON(res, 200, resultados);
        });
    } 
    else if (pathname === '/api/usuarios' && method === 'POST') {
        try {
            const datos = await recibirJSON(req);
            if (!datos.nombre || !datos.fecha_nacimiento || datos.nota === undefined) {
                return enviarJSON(res, 400, { error: 'Campos obligatorios incompletos.' });
            }
            pool.query('INSERT INTO usuarios (nombre, fecha_nacimiento, nota) VALUES (?, ?, ?)', 
            [datos.nombre, datos.fecha_nacimiento, datos.nota], (err, resultado) => {
                if (err) return enviarJSON(res, 500, { error: 'Error al insertar en la Base de Datos.' });
                enviarJSON(res, 21, { id: resultado.insertId, mensaje: 'Creado correctamente.' });
            });
        } catch (e) {
            enviarJSON(res, 400, { error: e.message });
        }
    } 
    // Captura dinámica de endpoints individuales con ID (/api/usuarios/:id)
    else if (pathname.startsWith('/api/usuarios/') && (method === 'PUT' || method === 'DELETE')) {
        const id = pathname.split('/')[3];
        if (!id || isNaN(id)) return enviarJSON(res, 400, { error: 'Identificador ID inválido.' });

        if (method === 'PUT') {
            try {
                const datos = await recibirJSON(req);
                pool.query('UPDATE usuarios SET nombre = ?, fecha_nacimiento = ?, nota = ? WHERE id = ?',
                [datos.nombre, datos.fecha_nacimiento, datos.nota, id], (err, resultado) => {
                    if (err) return enviarJSON(res, 500, { error: 'Error al actualizar la Base de Datos.' });
                    enviarJSON(res, 200, { mensaje: 'Registro modificado exitosamente.' });
                });
            } catch (e) {
                enviarJSON(res, 400, { error: e.message });
            }
        } else if (method === 'DELETE') {
            pool.query('DELETE FROM usuarios WHERE id = ?', [id], (err, resultado) => {
                if (err) return enviarJSON(res, 500, { error: 'Error al eliminar de la Base de Datos.' });
                enviarJSON(res, 200, { mensaje: 'Registro removido exitosamente.' });
            });
        }
    } 
    // Carga de la capa frontend de archivos estáticos por defecto
    else {
        servirArchivoEstatico(req, res, pathname);
    }
});

server.listen(PORT, () => {
    console.log(`\n===================================================`);
    console.log(`Servidor CRUD corriendo con éxito en el puerto: ${PORT}`);
    console.log(`Abre en tu navegador: http://localhost:${PORT}`);
    console.log(`===================================================\n`);
});