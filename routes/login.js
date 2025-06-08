const express = require('express');
const router = express.Router();
const db = require('../db'); // usa tu pool de conexión

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Faltan email o password' });
    }
    try {
        const [results] = await db.query('SELECT * FROM usuarios WHERE email = ? LIMIT 1', [email]);
        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }
        const user = results[0];
        // Para prueba, compara texto plano (no recomendado en producción)
        if (password === user.password_hash) {
            return res.json({
                success: true,
                usuario: {
                    id: user.id_usuario,
                    id_comunidad: "1", // <-- asegúrate que exista ese campo en tu tabla
                    nombre: user.nombre,
                    email: user.email
                }
            });
        } else {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Error en base de datos' });
    }
});

module.exports = router;