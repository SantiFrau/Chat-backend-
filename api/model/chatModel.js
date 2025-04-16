import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "Chat_db"
};

const connection = await mysql.createConnection(config);

export default class chatModel {
  // Verifica si un usuario existe por su ID
  static async existUser(id) {
    const [rows] = await connection.query(
      `SELECT id FROM users WHERE id = ?`,
      [id]
    );
    return rows.length > 0;
  }

  // Verifica si ya existe un chat entre dos usuarios
  static async chatExists(userId1, userId2) {
    const [rows] = await connection.query(
      `SELECT id FROM chats WHERE 
       (user_id1 = ? AND user_id2 = ?) OR 
       (user_id1 = ? AND user_id2 = ?)`,
      [userId1, userId2, userId2, userId1]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  // Crea un nuevo chat entre dos usuarios
  static async createChat({ userId1, userId2 }) {
    try {
      const user1Exists = await this.existUser(userId1);
      const user2Exists = await this.existUser(userId2);

      if (!user1Exists || !user2Exists) {
        return { error: "No existe uno de los usuarios", success: false };
      }

      const existingChat = await this.chatExists(userId1, userId2);
      if (existingChat) {
        return { error: "Ya existe un chat entre estos usuarios", success: false, chatId: existingChat.id };
      }

      const [result] = await connection.query(
        `INSERT INTO chats (user_id1, user_id2) VALUES (?, ?)`,
        [userId1, userId2]
      );

      return { message: "Chat creado", success: true, chatId: result.insertId };
    } catch (error) {
      return { error: error.message, success: false };
    }
  }

  // Elimina un chat por ID
  static async deleteChat({ chatId }) {
    try {
      const [result] = await connection.query(
        `DELETE FROM chats WHERE id = ?`,
        [chatId]
      );
      if (result.affectedRows === 0) {
        return { error: "Chat no encontrado", success: false };
      }
      return { message: "Chat eliminado", success: true };
    } catch (error) {
      return { error: error.message, success: false };
    }
  }

  // Crea un mensaje
  static async createMessage({ description, chatId, userId }) {
    try {
      const [result] = await connection.query(
        `INSERT INTO mensajes (chat_id, user_id, descripcion) VALUES (?, ?, ?)`,
        [chatId, userId, description]
      );
      return {
        message: "Mensaje insertado",
        success: true,
        messageId: result.insertId
      };
    } catch (error) {
      return { error: error.message, success: false };
    }
  }

  // Elimina un mensaje por ID
  static async deleteMessage({ id }) {
    try {
      const [result] = await connection.query(
        `DELETE FROM mensajes WHERE id = ?`,
        [id]
      );
      if (result.affectedRows === 0) {
        return { error: "Mensaje no encontrado", success: false };
      }
      return { message: "Mensaje eliminado", success: true };
    } catch (error) {
      return { error: error.message, success: false };
    }
  }
   
  //Obtener todos los chats del usuario
  static async get_chats({userId}){

   const sql = `
   SELECT
   c.id AS chatId,
   u.id AS userId,
   u.username,
   u.img,
   m.descripcion AS lastMessage,
   m.fecha AS messageDate,
   m.user_id = ? AS mine
 FROM chats c
 JOIN users u ON (u.id = IF(c.user_id1 = ?, c.user_id2, c.user_id1))
 LEFT JOIN (
   SELECT chat_id, descripcion, fecha, user_id
   FROM mensajes
   WHERE (chat_id, fecha) IN (
     SELECT chat_id, MAX(fecha)
     FROM mensajes
     GROUP BY chat_id
   )
 ) m ON c.id = m.chat_id
 WHERE c.user_id1 = ? OR c.user_id2 = ?
 ORDER BY m.fecha DESC;
 `
  const [rows] = await connection.query(sql, [userId, userId, userId, userId]);

  if(!rows.length>0){
   return {error:"Error en la consulta",success:false}}

  const chats = rows.map(row => ({
    chatid: row.chatId,
    user: {
      username: row.username,
      img: row.img
    },
    lastMessage: {
      description: row.lastMessage,
      date: new Date(row.messageDate).toLocaleString(),
      mine: !!row.mine
    }
  }));

  return {chats,success:true}
  }
  
  
 
}
