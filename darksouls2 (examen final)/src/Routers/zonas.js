const express = require('express');
const router = express.Router();
const db = require('../DB/database');

// ============================================================
// FUNCIÓN: Validar datos de la zona (Corregida)
// ============================================================
function validarZona(datos) {
    const errores = [];
    const dificultadesValidas = ['facil', 'medio', 'dificil', 'muy dificil', 'imposible'];

    // 1. Validar Nombre
    if (!datos.nombre || typeof datos.nombre !== 'string' || datos.nombre.trim().length < 2) {
        errores.push('El nombre de la zona es obligatorio (mínimo 2 caracteres)');
    }

    // 2. Validar Nivel Recomendado
    if (datos.nivel_recomendado === undefined || datos.nivel_recomendado === null || datos.nivel_recomendado === '') {
        errores.push('El nivel recomendado es obligatorio');
    } else {
        const nivel = parseInt(datos.nivel_recomendado);
        if (isNaN(nivel) || nivel < 1) {
            errores.push('El nivel recomendado debe ser un número mayor a 0');
        } else if (nivel > 100) {
            errores.push('Error en BD: El nivel recomendado no puede ser mayor a 100');
        }
    }

    // 3. Validar Total de Hogueras
    if (datos.total_hogueras === undefined || datos.total_hogueras === null || datos.total_hogueras === '') {
        errores.push('El total de hogueras es obligatorio');
    } else {
        const hogueras = parseInt(datos.total_hogueras);
        if (isNaN(hogueras) || hogueras < 0) {
            errores.push('El total de hogueras no puede ser negativo');
        } else if (hogueras > 5) {
            errores.push('Error en BD: El total de hogueras registradas no puede superar el límite de 5');
        }
    }

    // 4. Validar Dificultad
    if (!datos.dificultad || !dificultadesValidas.includes(datos.dificultad)) {
        errores.push('La dificultad debe ser: facil, medio, dificil, muy dificil o imposible');
    }

    return errores;
}

// ============================================================
// 1. LISTAR ZONAS (Trae también los jefes agrupados)
// ============================================================
router.get('/', async (req, res) => {
    try {
        // El LEFT JOIN junta las zonas con los jefes, y GROUP_CONCAT los junta en una sola cadena de texto
        const [filas] = await db.execute(`
            SELECT z.id, z.nombre, z.nivel_recomendado, z.total_hogueras, z.dificultad,
                   GROUP_CONCAT(j.nombre SEPARATOR ', ') AS jefes
            FROM zonas z
            LEFT JOIN jefes j ON z.id = j.zona_id
            GROUP BY z.id
            ORDER BY z.id DESC
        `);
        
        res.json({
            status: 'success',
            data: filas
        });
    } catch (error) {
        console.error('Error al listar zonas:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// 2. OBTENER UNA ZONA POR ID
// ============================================================
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [filas] = await db.execute('SELECT * FROM zonas WHERE id = ?', [id]);

        if (filas.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Zona no encontrada' });
        }

        res.json({ status: 'success', data: filas[0] });
    } catch (error) {
        console.error('Error al obtener zona:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// 3. CREAR ZONA
// ============================================================
router.post('/', async (req, res) => {
    try {
        const errores = validarZona(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ status: 'error', message: errores.join(', ') });
        }

        const { nombre, nivel_recomendado, total_hogueras, dificultad } = req.body;

        const [resultado] = await db.execute(
            'INSERT INTO zonas (nombre, nivel_recomendado, total_hogueras, dificultad) VALUES (?, ?, ?, ?)',
            [nombre.trim(), nivel_recomendado, total_hogueras, dificultad]
        );

        res.status(201).json({
            status: 'success',
            data: { id: resultado.insertId, nombre, nivel_recomendado, total_hogueras, dificultad }
        });
    } catch (error) {
        console.error('Error al crear zona:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// 4. ACTUALIZAR ZONA
// ============================================================
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const errores = validarZona(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ status: 'error', message: errores.join(', ') });
        }

        const [existe] = await db.execute('SELECT id FROM zonas WHERE id = ?', [id]);
        if (existe.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Zona no encontrada' });
        }

        const { nombre, nivel_recomendado, total_hogueras, dificultad } = req.body;

        await db.execute(
            'UPDATE zonas SET nombre = ?, nivel_recomendado = ?, total_hogueras = ?, dificultad = ? WHERE id = ?',
            [nombre.trim(), nivel_recomendado, total_hogueras, dificultad, id]
        );

        res.json({
            status: 'success',
            data: { id, nombre, nivel_recomendado, total_hogueras, dificultad }
        });
    } catch (error) {
        console.error('Error al actualizar zona:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// 5. ELIMINAR ZONA
// ============================================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [zona] = await db.execute('SELECT id, nombre FROM zonas WHERE id = ?', [id]);

        if (zona.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Zona no encontrada' });
        }

        await db.execute('DELETE FROM zonas WHERE id = ?', [id]);

        res.json({
            status: 'success',
            data: { mensaje: `Zona "${zona[0].nombre}" eliminada correctamente` }
        });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
            return res.status(409).json({
                status: 'error',
                message: 'No se puede eliminar la zona porque tiene jefes habitando en ella'
            });
        }
        console.error('Error al eliminar zona:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;