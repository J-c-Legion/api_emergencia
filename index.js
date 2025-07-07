const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./db');

app.use(express.json());

// Importar rutas
const registerRouter = require('./routes/register');
const perfilRoutes = require('./routes/perfil');
const usuariosRoutes = require('./routes/usuarios');
const loginRoutes = require('./routes/login');
const comunidadesRoutes = require('./routes/comunidades');
const alertasRoutes = require('./routes/alertas');
const mensajesRoutes = require('./routes/mensajes');

// Montar rutas
app.use('/register', registerRouter);
app.use('/perfil', perfilRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/login', loginRoutes);
app.use('/comunidades', comunidadesRoutes);
app.use('/alertas', alertasRoutes);
app.use('/mensajes', mensajesRoutes);

// Ruta raíz de prueba
app.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() as hora_actual');
    res.send(`Conexión exitosa. Hora del servidor MySQL: ${rows[0].hora_actual}`);
  } catch (error) {
    res.status(500).send('Error de conexión: ' + error.message);
  }
});

// Arrancar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
