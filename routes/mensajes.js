const express = require('express');
const router = express.Router();
const db = require('../db');

// msn
router.post('/enviar', async (req, res) => {
  const { id_usuario, id_comunidad, mensaje } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO mensajes (id_usuario, id_comunidad, contenido)
       VALUES (?, ?, ?)`,
      [id_usuario, id_comunidad, mensaje]
    );
    res.status(201).json({ mensaje: 'Mensaje enviado', id_mensaje: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar mensaje', detalles: error.message });
  }
});

// ver msn
router.get('/comunidad/:id_comunidad', async (req, res) => {
  const { id_comunidad } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT m.id_mensaje, m.contenido AS mensaje, m.fecha_envio, u.nombre 
       FROM mensajes m
       JOIN usuarios u ON m.id_usuario = u.id_usuario
       WHERE m.id_comunidad = ?
       ORDER BY m.fecha_envio ASC`,
      [id_comunidad]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mensajes', detalles: error.message });
  }
});

module.exports = router;
