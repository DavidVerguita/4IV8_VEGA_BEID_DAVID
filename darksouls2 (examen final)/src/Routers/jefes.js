const express = require('express');
const router = express.Router();
const db = require('../DB/database');

// 1. LISTAR JEFES (Hace un JOIN para traer el nombre real de su Zona habitada)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT j.*, z.nombre AS zona_nombre 
            FROM jefes j
            LEFT JOIN zonas z ON j.zona_id = z.id
            ORDER BY j.id DESC
        `;
        const [rows] = await db.execute(query);
        res.json({ status: 'success', count: rows.length, data: rows });
    } catch (error) {
        console.error("Error al obtener jefes:", error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 2. OBTENER UN JEFE ESPECÍFICO POR ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM jefes WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Jefe no encontrado en Lordran' });
        }
        res.json({ status: 'success', data: rows[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 3. REGISTRAR UN NUEVO JEFE
router.post('/', async (req, res) => {
    try {
        const { nombre, zona_id, dificultad, nivel_recomendado, item_recomendado } = req.body;

        if (!nombre || !zona_id || !dificultad || !nivel_recomendado) {
            return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
        }

        // VALIDACIÓN AGREGADA: Límite de nivel 100
        if (parseInt(nivel_recomendado) > 100) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Error en BD: El nivel del jefe excede el límite permitido de 100' 
            });
        }

        const query = 'INSERT INTO jefes (nombre, zona_id, dificultad, nivel_recomendado, item_recomendado) VALUES (?, ?, ?, ?, ?)';
        const [resultado] = await db.execute(query, [
            nombre, 
            parseInt(zona_id), 
            dificultad, 
            parseInt(nivel_recomendado), 
            item_recomendado || null
        ]);

        res.status(201).json({ status: 'success', data: { id: resultado.insertId } });
    } catch (error) {
        console.error("Error en POST jefes:", error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 4. ACTUALIZAR UN JEFE EXISTENTE
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, zona_id, dificultad, nivel_recomendado, item_recomendado } = req.body;

        if (!nombre || !zona_id || !dificultad || !nivel_recomendado) {
            return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
        }

        // VALIDACIÓN AGREGADA: Límite de nivel 100
        if (parseInt(nivel_recomendado) > 100) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Error en BD: El nivel del jefe excede el límite permitido de 100' 
            });
        }

        const query = 'UPDATE jefes SET nombre = ?, zona_id = ?, dificultad = ?, nivel_recomendado = ?, item_recomendado = ? WHERE id = ?';
        await db.execute(query, [
            nombre, 
            parseInt(zona_id), 
            dificultad, 
            parseInt(nivel_recomendado), 
            item_recomendado || null, 
            id
        ]);

        res.json({ status: 'success', message: 'Jefe actualizado correctamente' });
    } catch (error) {
        console.error("Error en PUT jefes:", error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 5. ELIMINAR UN JEFE
router.delete('/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM jefes WHERE id = ?', [req.params.id]);
        res.json({ status: 'success', message: 'Jefe eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;