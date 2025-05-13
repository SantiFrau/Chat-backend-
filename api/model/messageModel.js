import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "Chat_db"
};


const connection = await mysql.createConnection(config);

export default class messageModel{


    static async InsertMessage({data,chatId,userId,date}){
        
        function formatDateToMySQL(date) {
            const d = new Date(date);
            return d.toISOString().slice(0, 19).replace('T', ' ');
          }
          

        const formattedDate = formatDateToMySQL(date)
          
        try{
            const res = await connection.query(`
            INSERT INTO mensajes (chat_id, user_id, descripcion, fecha) VALUES ( ? , ? , ? , ?)`,[chatId,userId,data,formattedDate])

            return {success:true,mensaje:"Mensaje insertado"}
        } catch(error){
            return {success:false,error:"Error al insertar el mensaje"}
        }
    }


    static async GetMessages({chatId, userId}) {
        try {
            const [rows] = await connection.query(
                `SELECT user_id, descripcion, fecha FROM mensajes WHERE chat_id = ?`,
                [chatId]
            );
    
            if (rows.length > 0) {
                const messages = rows.map((mensaje) => ({
                    description: mensaje.descripcion,
                    date: mensaje.fecha,
                    mine: userId == mensaje.user_id
                }));
    
                return { success: true, messages };
            } else {
                return { success: true, messages:[] };
            }
        } catch (error) {
            return { success: false, error: "Error en la consulta BD" };
        }
    }
    

}