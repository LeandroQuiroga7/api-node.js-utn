const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const app = express();

// base de datos
connectDB();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/users', require('./routes/userRoutes'));

// prueba
app.get('/', (req, res) => {
  res.json({ success: true, message: "API funcionando" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));