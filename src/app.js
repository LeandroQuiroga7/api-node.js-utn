const express = require('express');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io');
const connectDB = require('./db');
const Message = require('./models/message'); 
require('dotenv').config();

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
    cors: { origin: "*" } 
});


connectDB();


app.use(cors());
app.use(express.json());
app.use(express.static('public'));


app.use('/api/users', require('./routes/userRoutes'));


io.on('connection', async (socket) => {
    console.log('Usuario conectado:', socket.id);

    
    try {
        const messages = await Message.find()
            .populate('user', 'username') 
            .sort({ createdAt: -1 })
            .limit(50);
        
        socket.emit('historial', messages.reverse());
    } catch (err) {
        console.error('Error al cargar historial:', err);
    }

    
    socket.on('mensaje-enviado', async (data) => {
        try {
            const nuevoMensaje = new Message({
                text: data.text,
                user: data.userId 
            });
            
            await nuevoMensaje.save();

            
            io.emit('mensaje-recibido', {
                username: data.username,
                text: data.text
            });
        } catch (err) {
            console.error('Error guardando mensaje:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});