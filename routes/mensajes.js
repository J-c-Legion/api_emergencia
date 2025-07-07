const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener mensajes de una comunidad
router.get('/:id_comunidad', async (req, res) => {
  const id_comunidad = req.params.id_comunidad;
  try {
    const [mensajes] = await pool.query(`
      SELECT m.id_mensaje, m.id_usuario, u.nombre, m.contenido, m.fecha_envio
      FROM mensajes m
      JOIN usuarios u ON m.id_usuario = u.id_usuario
      WHERE m.id_comunidad = ?
      ORDER BY m.fecha_envio ASC
    `, [id_comunidad]);

    res.json(mensajes);
  } catch (error) {
    console.error('❌ Error al obtener mensajes:', error);
    res.status(500).json({ mensaje: 'Error interno' });
  }
});

// Enviar nuevo mensaje
router.post('/', async (req, res) => {
  const { id_usuario, id_comunidad, contenido } = req.body;

  try {
    await pool.query(`
      INSERT INTO mensajes (id_usuario, id_comunidad, contenido, fecha_envio)
      VALUES (?, ?, ?, NOW())
    `, [id_usuario, id_comunidad, contenido]);

    res.json({ mensaje: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error);
    res.status(500).json({ mensaje: 'Error interno al enviar mensaje' });
  }
});

module.exports = router;
