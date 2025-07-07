const express = require('express');
const router = express.Router();
const pool = require('../db'); // Asegúrate de que sea pool, no db

// 📥 GET: Obtener perfil del usuario por ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  console.log("📥 GET /perfil/" + id);

  try {
    const [usuario] = await pool.query(`
      SELECT u.id_usuario, u.nombre, u.dni, u.telefono, u.email, u.enfermedades, u.fecha_registro,
             uc.id_comunidad, uc.rol, uc.fecha_union
      FROM usuarios u
      LEFT JOIN usuarios_comunidades uc ON u.id_usuario = uc.id_usuario
      WHERE u.id_usuario = ?
    `, [id]);

    if (!usuario || usuario.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario[0]); // 👈 devolvemos solo un objeto plano
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// ✏️ PUT: Actualizar perfil del usuario
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { nombre, dni, telefono, email, enfermedades, id_comunidad } = req.body;
  console.log("✏️ PUT /perfil/" + id, req.body);

  try {
    // Actualizar datos en tabla usuarios
    await pool.query(`
      UPDATE usuarios
      SET nombre = ?, dni = ?, telefono = ?, email = ?, enfermedades = ?
      WHERE id_usuario = ?
    `, [nombre, dni, telefono, email, enfermedades, id]);

    // Actualizar comunidad en tabla usuarios_comunidades
    await pool.query(`
      UPDATE usuarios_comunidades
      SET id_comunidad = ?
      WHERE id_usuario = ?
    `, [id_comunidad, id]);

    res.json({ mensaje: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    res.status(500).json({ mensaje: 'Error interno al actualizar perfil' });
  }
});

module.exports = router;
