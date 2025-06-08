const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios', detalles: error.message });
  }
});

router.post('/registrar', async (req, res) => {
  const { nombre, dni, telefono, email, password_hash, enfermedades } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO usuarios (nombre, dni, telefono, email, password_hash, enfermedades)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, dni, telefono, email, password_hash, enfermedades]
    );
    res.status(201).json({ mensaje: 'Usuario registrado', id_usuario: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario', detalles: error.message });
  }
});

module.exports = router;
