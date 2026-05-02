const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos en Google Cloud
const db = mysql.createConnection({
  host: '34.31.23.74', // 
  user: 'admin_pwa',
  port: 3306,
  password: 'TuContraseñaSegura123', 
  database: 'perfumeria'
});

db.connect(err => {
  if(err) {
    console.error('Error conectando a la BD:', err);
  } else {
    console.log('¡Conectado a MariaDB con éxito!');
  }
});

// Ruta de Login
app.post('/api/login', (req, res) => {
  const { correo, password } = req.body;
  const query = 'SELECT * FROM usuarios WHERE correo = ? AND password = ?';
  
  db.query(query, [correo, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error del servidor' });
    if (results.length > 0) {
      res.json({ success: true, mensaje: 'Inicio exitoso', usuario: results[0].nombre });
    } else {
      res.status(401).json({ success: false, mensaje: 'Credenciales incorrectas' });
    }
  });
});

// Ruta de Registro
app.post('/api/register', (req, res) => {
  const { nombre, correo, password } = req.body;
  const query = 'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)';
  
  db.query(query, [nombre, correo, password], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, mensaje: 'El correo ya existe' });
      return res.status(500).json({ success: false, mensaje: 'Error interno' });
    }
    res.json({ success: true, mensaje: '¡Registro exitoso!' });
  });
});

// Arrancar el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API corriendo en el puerto ${PORT}`);
});