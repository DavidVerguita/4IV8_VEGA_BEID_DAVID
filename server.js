// SERVIDOR OPTIMIZADO CON EXPRESS.JS
// Examen PNT - Segundo Parcial


const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar JSON en las peticiones
app.use(express.json());


app.use(express.static('public'));

// Configuración de la conexión a la Base de Datos
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mikonito0o*',
    database: 'pnt_practica1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Obtener todos los usuarios de la base de datos (GET)
app.get('/api/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios');
        res.json(rows); 
    } catch (error) {
        console.error("Error en MySQL:", error);
        res.status(500).json({ mensaje: 'Error al consultar la base de datos', error: error.message });
    }
});
app.post('/api/usuarios', async (req, res) => {
    try {
        // Express extrae de forma automática los datos del formulario gracias a app.use(express.json())
        const { nombre, fecha_nacimiento, nota } = req.body;

        // Consulta SQL para insertar el nuevo registro
        const sql = 'INSERT INTO usuarios (nombre, fecha_nacimiento, nota) VALUES (?, ?, ?)';
        const [result] = await pool.query(sql, [nombre, fecha_nacimiento, nota]);

        // Respondemos con el ID asignado por MySQL para confirmar que se creó
        res.status(201).json({ id: result.insertId, nombre, fecha_nacimiento, nota });
    } catch (error) {
        console.error("Error al insertar en MySQL:", error);
        res.status(500).json({ mensaje: 'Error al guardar el usuario', error: error.message });
    }
});
// Inicializar el servidor Express
app.listen(PORT, () => {
    console.log(`Servidor Express optimizado corriendo en el puerto: ${PORT}`);
});