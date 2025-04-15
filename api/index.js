import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
//crear server para con node para pasarselo a sockeio y crear el websocket
const server = http.createServer(app);

// Middleware
app.use(cors()); //cors
app.use(express.json()); //formatear los chuncks

// WebSocket
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// Middleware auth con JWT para sockets
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

// Endpoint para login y obtener token
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Simulación de auth
  if (username === 'usuario1' && password === '1234') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  res.status(401).json({ error: 'Credenciales inválidas' });
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
