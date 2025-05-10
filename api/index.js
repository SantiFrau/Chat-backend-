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
import messageModel from './model/messageModel.js';
import { socketHandler } from './socket/socket.js';
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
  userModel,
  messageModel
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

socketHandler({io,AppModel})



// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);   
});
