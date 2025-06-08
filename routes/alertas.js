const express = require('express');
const router = express.Router();
const db = require('../db');

// al
  router.post('/crear', async (req, res) => {
  const { id_usuario, id_comunidad, tipo_alerta, mensaje, ubicacion_gps } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO alertas (id_usuario, id_comunidad, tipo_alerta, mensaje, ubicacion_gps)
       VALUES (?, ?, ?, ?, ?)`,
      [id_usuario, id_comunidad, tipo_alerta, mensaje, ubicacion_gps]
    );
    res.status(201).json({ mensaje: 'Alerta enviada', id_alerta: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear alerta', detalles: error.message });
  }
});

// ver
router.get('/comunidad/:id_comunidad', async (req, res) => {
  const { id_comunidad } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT a.*, u.nombre FROM alertas a
       JOIN usuarios u ON a.id_usuario = u.id_usuario
       WHERE a.id_comunidad = ? ORDER BY a.fecha_alerta DESC`,
      [id_comunidad]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
});
router.get('/recientes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM alertas ORDER BY fecha_alerta DESC LIMIT 20');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo alertas' });
  }
});
module.exports = router;
