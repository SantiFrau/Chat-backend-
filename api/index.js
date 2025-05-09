import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// Rutas y modelos
import createUserRoutes from './routes/userRoutes.js';
import createChatsRoutes from './routes/chatRoutes.js';
import chatModel from './model/chatModel.js';
import userModel from './model/userModel.js';
import { validateTokenSocket } from './middleware/validateToken.js';

// Cargar variables de entorno
dotenv.config();



const app = express();
const server = http.createServer(app); // Crear servidor HTTP con Express
const PORT = process.env.PORT || 3000;




// Middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json()); // Parsear JSON

// Modelos compartidos
const AppModel = {
  chatModel,
  userModel
};

// Rutas
const userRoutes = createUserRoutes({ AppModel });
const chatRoutes = createChatsRoutes({ AppModel });

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

// WebSocket config
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.use(validateTokenSocket)

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Escucha para unirse a una sala
  socket.on('join', (chatsId) => {
    chatsId.forEach(id => {
      socket.join(id);
      console.log(`Usuario ${socket.user.username} se unió a la sala ${id}`);
    });
  });

  
  socket.on('send-message', ({ chatId, message }) => {
    // Obtener todos los sockets conectados a esa sala
    const mine = !message.mine
    message = {...message , mine}

    const socketsInRoom = io.sockets.adapter.rooms.get(chatId);
    
    // Emitir el mensaje a todos los demás sockets en la sala (excepto al que lo envió)
    if (socketsInRoom) {
      socketsInRoom.forEach((socketId) => {
        if (socketId !== socket.id) {
          io.to(socketId).emit('receive-message', { message ,username:socket.user.username });
          console.log(`${socket.user.username} envió un mensaje a ${socketId}`);
        }
      });
    }

    console.log(`${socket.user.username} envió un mensaje a la sala ${chatId}`);
  });

  // Evento de desconexión
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});


// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);   
});
