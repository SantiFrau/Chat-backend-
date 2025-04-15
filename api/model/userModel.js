import mysql from "mysql2/promise";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";


const secret_var = process.env.JWT_SECRET

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "Chat_db"
};

const connection = await mysql.createConnection(config);

export default class userModel {

  static async exist({ username }) {
    const [res] = await connection.query(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );
    if(res.length > 0) {
        return res[0]
    }else{
        return false
    };
  }

  static async register({ data }) {
    const userExists = await this.exist({ username: data.username });
    if (userExists) {
      return { error: "Usuario ya existe", success: false };
    }

    const hashedPassword = await argon2.hash(data.password);
    const uuid = uuidv4();

    await connection.query(
      `INSERT INTO users (id, username, password, img) VALUES (?, ?, ?, ?)`,
      [uuid, data.username, hashedPassword, data.img]
    );

    const token = jwt.sign(
      {
        id: uuid,
        username: data.username,
        img: data.img
      },
      secret_var,
      { expiresIn: "2h" }
    );

    return { token, success: true };
  }

  static async login({ username, password }) {
    const user = await this.exist({ username });
  
    if (!user) {
      return { error: "Usuario no existe", success: false };
    }
  
    const passwordCorrect = await argon2.verify(user.password, password);
    if (!passwordCorrect) {
      return { error: "Contraseña incorrecta", success: false };
    }
  
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        img: user.img
      },
      secret_var,
      { expiresIn: "2h" }
    );
  
    return { token, success: true };
  }
  
}
