import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Rutas y modelos
import createUserRoutes from './routes/userRoutes.js';
import createChatsRoutes from './routes/chatRoutes.js';
import chatModel from './model/chatModel.js';
import userModel from './model/userModel.js';

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
app.use("/chats", chatRoutes);

// WebSocket config
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Autenticación de socket con JWT
io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) return next(new Error('Token requerido'));

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Token inválido'));
  }
});

// Manejo de conexiones WebSocket
io.on('connection', (socket) => {
  console.log('✅ Usuario conectado:', socket.user.username);

  socket.on('mensaje', (data) => {
    console.log(`Mensaje recibido de ${socket.user.username}:`, data);
    io.emit('mensaje', {
      user: socket.user.username,
      mensaje: data
    });
  });

  socket.on('disconnect', () => {
    console.log('❌ Usuario desconectado:', socket.user.username);
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
