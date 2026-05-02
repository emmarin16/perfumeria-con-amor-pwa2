const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos en Google Cloud
const db = mysql.createConnection({
  host: '34.31.23.74',
  user: 'admin_pwa',
  port: 3306,
  password: 'TuContraseñaSegura123', 
  database: 'perfumeria',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.query('SELECT 1', (err, results) => {
  if (err) {
    console.error('Error inicial de conexión a MariaDB:', err.message);
  } else {
    console.log('¡Conectado a MariaDB con éxito desde Render!');
  }
})

// Ruta de Login
app.post('/api/login', (req, res) => {
  const { correo, password } = req.body;
  const query = 'SELECT * FROM usuarios WHERE correo = ?';

  db.query(query, [correo], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error del servidor' });
    
    if (results.length > 0) {
      const usuario = results[0];
      // Comparamos la contraseña escrita con el hash de la base de datos
      const esValida = await bcrypt.compare(password, usuario.password);
      
      if (esValida) {
        res.json({ success: true, mensaje: 'Inicio exitoso', usuario: usuario.nombre });
      } else {
        res.status(401).json({ success: false, mensaje: 'Credenciales incorrectas' });
      }
    } else {
      res.status(401).json({ success: false, mensaje: 'Usuario no encontrado' });
    }
  });
});

// Ruta de Registro
app.post('/api/register', async (req, res) => {
  const { nombre, correo, password } = req.body;
  
  try {
    // Generamos el hash de la contraseña (el número 10 es el nivel de seguridad)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = 'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)';
    db.query(query, [nombre, correo, hashedPassword], (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, mensaje: 'El correo ya existe' });
        return res.status(500).json({ success: false, mensaje: 'Error interno' });
      }
      res.json({ success: true, mensaje: '¡Registro exitoso con seguridad!' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al encriptar' });
  }
});

// Arrancar el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API corriendo en el puerto ${PORT}`);
});