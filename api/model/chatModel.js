import mysql from "mysql2/promise";


const secret_var = process.env.JWT_SECRET

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "Chat_db"
};

const connection = await mysql.createConnection(config);

export class chatModel{

    static async crearChat({userId1,userId2}){
        
    }
}