const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./db');

app.use(express.json());

const registerRouter = require('./routes/register');

// RUTAS
app.use('/login', require('./routes/login'));
app.use('/usuarios', require('./routes/usuarios'));
app.use('/comunidades', require('./routes/comunidades'));
app.use('/alertas', require('./routes/alertas'));
app.use('/mensajes', require('./routes/mensajes'));
app.use('/register', registerRouter);

// Ruta base
app.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() as hora_actual');
    res.send(`Conexión exitosa. Hora del servidor MySQL: ${rows[0].hora_actual}`);
  } catch (error) {
    res.status(500).send('Error de conexión: ' + error.message);
  }
});

const PORT = 4000; // <<--- AQUÍ FIJAS EL PUERTO A 4000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});