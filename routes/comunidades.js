const express = require('express');
const router = express.Router();
const db = require('../db');

// Crear comunidad
router.post('/crear', async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO comunidades (nombre, descripcion) VALUES (?, ?)`,
      [nombre, descripcion]
    );
    res.status(201).json({ mensaje: 'Comunidad creada', id_comunidad: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear comunidad', detalles: error.message });
  }
});

// Lista
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM comunidades`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar comunidades' });
  }
});

module.exports = router;
