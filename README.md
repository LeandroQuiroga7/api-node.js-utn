# API para Clon de Chat 🚀

Este proyecto es una aplicación de chat en tiempo real con un sistema de usuarios integrado. Permite el registro, inicio de sesión seguro y comunicación bidireccional entre usuarios conectados.

## 🛠️ Tecnologías Utilizadas
- **Backend:** Node.js y Express
- **Base de Datos:** MongoDB Atlas a través de Mongoose
- **Comunicación en Tiempo Real:** Socket.io
- **Seguridad:** Bcryptjs (hashing de contraseñas) y JWT (autenticación)
- **Validación:** Joi
- **Frontend:** HTML5, Tailwind CSS y Vanilla JavaScript

---

## 🚀 Pasos de Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/LeandroQuiroga7/api-node.js-utn
   cd api-node.js-utn
2. **Instalar dependencias:**
   ```bash
   npm install
3. **Configurar variables de entorno:**

   Crear un archivo .env en la raíz del proyecto y completar con sus credenciales:
   ```bash
   PORT=3000
   MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/chat-db
   JWT_SECRET=tu_clave_secreta_aqui
4. **Ejecutar el servidor:**
   ```bash
   node src/app.js
  El servidor estará disponible en http://localhost:3000.

---

## 📡 Descripción de Endpoints
1. **Registro de Usuario**

- **URL:** POST /api/users/register

- **Descripción:** Valida los datos con Joi, encripta la contraseña y guarda al usuario en la base de datos.

- **Ejemplo de Request:**
  ```json
  {
    "username": "leandro_test",
    "email": "leandro@test.com",
    "password": "password123"
  }
- **Ejemplo de Response (200 OK):**
   ```json
   {
     "ok": true,
     "msg": "Usuario creado con éxito"
   }
2. **Login de Usuario**

- **URL:** POST /api/users/login

- **Descripción:** Verifica las credenciales y genera un token JWT para el usuario.

- **Ejemplo de Request:**
   ```json
   {
     "email": "leandro@test.com",
     "password": "password123"
   }
- **Ejemplo de Response (200 OK):**
   ```json
   {
     "ok": true,
     "user": {
       "id": "60a7...",
       "username": "leandro_test"
     },
     "token": "eyJhbGciOiJIUzI1..."
   }
---

## 💻 Conexión con el Frontend
El frontend se encuentra en la carpeta /public y es servido de forma estática por Express.

**Consumo de API:** Se utiliza fetch para enviar peticiones POST a los endpoints de /register y /login.

**WebSockets:** Una vez autenticado, el cliente se conecta mediante io() de Socket.io.

- Envía mensajes mediante el evento: mensaje-enviado.

- Escucha mensajes nuevos mediante el evento: mensaje-recibido.

- Carga el historial inicial desde la base de datos mediante el evento: historial.

---

## 📁 Estructura del Proyecto
- src/controllers/: Lógica de los endpoints.

- src/models/: Esquemas de Mongoose.

- src/routes/: Definición de rutas de la API.

- src/app.js: Punto de entrada y configuración de Sockets.

- public/: Archivos del cliente (HTML/JS).