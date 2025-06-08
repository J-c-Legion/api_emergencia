const express = require('express');
const router = express.Router();
const db = require('../db'); // tu pool de conexión

router.post('/', async (req, res) => {
  const { nombre, dni, telefono, email, password, enfermedades } = req.body;
  if (!nombre || !dni || !telefono || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }
  try {
    // Verificar que el email no esté usado
    const [existing] = await db.query('SELECT id_usuario FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'El email ya está en uso' });
    }
    // Insertar usuario
    await db.query(
      'INSERT INTO usuarios (nombre, dni, telefono, email, password_hash, enfermedades) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, dni, telefono, email, password, enfermedades || '']
    );
    return res.json({ success: true, mensaje: 'Usuario registrado' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error en el registro' });
  }
});

module.exports = router;