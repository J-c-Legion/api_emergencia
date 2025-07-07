const express = require('express');
const router = express.Router();
const db = require('../db');
const admin = require('../firebase'); // Firebase Admin SDK

// ✅ Enviar alerta y notificación a la comunidad
router.post('/crear', async (req, res) => {
  const { id_usuario, id_comunidad, tipo_alerta, mensaje, ubicacion_gps } = req.body;

  try {
    // 1. Guardar la alerta en la base de datos
    const [result] = await db.query(
      `INSERT INTO alertas (id_usuario, id_comunidad, tipo_alerta, mensaje, ubicacion_gps)
       VALUES (?, ?, ?, ?, ?)`,
      [id_usuario, id_comunidad, tipo_alerta, mensaje, ubicacion_gps]
    );

    // 2. Enviar notificación FCM al topic de la comunidad
    const topic = `comunidad_${id_comunidad}`;

    const notification = {
      topic: topic,
      notification: {
        title: '🚨 Nueva Alerta de Emergencia',
        body: mensaje || 'Se ha reportado una emergencia en tu comunidad.',
      },
      data: {
        tipo_alerta: tipo_alerta || 'general',
        comunidad_id: id_comunidad.toString(),
        id_alerta: result.insertId.toString(),
      }
    };

    // Enviar notificación con .send() (válido en versiones modernas)
    await admin.messaging().send(notification);

    res.status(201).json({ mensaje: 'Alerta enviada y notificada', id_alerta: result.insertId });

  } catch (error) {
    console.error('❌ Error al crear alerta:', error);
    res.status(500).json({ error: 'Error al crear alerta', detalles: error.message });
  }
});

// ✅ Obtener alertas de una comunidad
router.get('/comunidad/:id_comunidad', async (req, res) => {
  const { id_comunidad } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT a.*, u.nombre FROM alertas a
       JOIN usuarios u ON a.id_usuario = u.id_usuario
       WHERE a.id_comunidad = ?
       ORDER BY a.fecha_alerta DESC`,
      [id_comunidad]
    );

    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alertas', detalles: error.message });
  }
});

// ✅ Obtener últimas alertas recientes
router.get('/recientes', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM alertas ORDER BY fecha_alerta DESC LIMIT 20'
    );
    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo alertas', detalles: error.message });
  }
});

module.exports = router;
