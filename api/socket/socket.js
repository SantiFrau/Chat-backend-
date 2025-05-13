import messageController from "../controller/messageController.js";
import { validateTokenSocket } from "../middleware/validateToken.js";


export function socketHandler({io, AppModel}) {
    io.use(validateTokenSocket);
    const message_controller = new messageController({AppModel})
  
    io.on('connection', (socket) => {
      console.log('Nuevo cliente conectado:', socket.id);
  
      socket.on('join', (chatsId) => {
        console.log("a")
        chatsId.forEach(id => {
          socket.join(id);
          console.log(`Usuario ${socket.user.username} se unió a la sala ${id}`);
        });
      });
  
      socket.on('send-message', async ({ chatId, message }) => {
        try {
          
          // Guardar mensaje en la base de datos
          const res = await message_controller.InsertMessage({
            message,
            chatId,
            userId: socket.user.id,
          });
        
          if (!res.success) return;

           //invertir el mine cuando re emita el mensaje
           const mine = !message.mine;
           const mensajeConMine = { ...message, mine };
  
          const socketsInRoom = io.sockets.adapter.rooms.get(chatId);
  
          if (socketsInRoom) {
            socketsInRoom.forEach((socketId) => {
              if (socketId !== socket.id) {
                io.to(socketId).emit('receive-message', {
                  message: mensajeConMine,
                  username: socket.user.username,
                });
                console.log(`${socket.user.username} envió un mensaje a ${socketId}`);
              }
            });
          }
  
          console.log(`${socket.user.username} envió un mensaje a la sala ${chatId}`);
        } catch (err) {
          console.error("Error en send-message:", err);
        }
      });
  
      socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
      });
    });
  }