import mysql from "mysql2/promise";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";


const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "Chat_db"
};

const connection = await mysql.createConnection(config);

export default class userModel {
  
  static async get_users({ search = "", excludeId }) {
    try {
      const likeSearch = `%${search}%`;
      const [rows] = await connection.query(
        `SELECT id, username, img FROM users WHERE username LIKE ? AND id != ?`,
        [likeSearch, excludeId]
      );

      return {
        users: rows,
        success: true,
        message: rows.length > 0 ? "Usuarios encontrados" : "No se encontraron usuarios"
      };
    } catch (error) {
      return { error: "Error al buscar usuarios", details: error.message, success: false };
    }
  }

  static async exist({ username }) {
    try {
      const [res] = await connection.query(
        `SELECT * FROM users WHERE username = ?`,
        [username]
      );

      return res.length > 0 ? res[0] : false;
    } catch (error) {
      
      return false;
    }
  }

  static async register({ data }) {
    try {
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
        { id: uuid, username: data.username, img: data.img },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      return { token, success: true };
    } catch (error) {
      console.log(error)
      return { error: "Error al registrar usuario", details: error.message, success: false };
    }
  }

  static async login({ username, password }) {
    try {
      const user = await this.exist({ username });
      if (!user) {
        return { error: "Usuario no existe", success: false };
      }

      const passwordCorrect = await argon2.verify(user.password, password);
      if (!passwordCorrect) {
        return { error: "Contraseña incorrecta", success: false };
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, img: user.img },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      return { token, success: true };
    } catch (error) {
      return { error: "Error al iniciar sesión", details: error.message, success: false };
    }
  }
}
