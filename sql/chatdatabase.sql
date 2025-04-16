DROP DATABASE IF EXISTS Chat_db;
CREATE DATABASE Chat_db;
USE Chat_db;

-- Tabla de usuarios
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  img TEXT
);

-- Tabla de chats
CREATE TABLE chats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id1 CHAR(36) NOT NULL,
  user_id2 CHAR(36) NOT NULL,
  FOREIGN KEY (user_id1) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id2) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT no_self_chat CHECK (user_id1 <> user_id2)
);

-- Tabla de mensajes
CREATE TABLE mensajes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  chat_id INT NOT NULL,
  user_id CHAR(36) NOT NULL,
  descripcion TEXT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertar usuarios con UUIDs fijos para pruebas
INSERT INTO users (id, username, password, img) VALUES
('d6b3e21a-5f0f-4e19-b2d6-7a4c95a1fd01', 'juanp',    '$argon2id$v=19$m=65536,t=3,p=4$IAY1tf8dofFRVthKp/dmmg$q3JzGvjBvmgS9YFGvkDgf5rPz9RPHuqJIkckN1IvsPg', 'https://example.com/images/juanp.jpg'),
('a4210b9e-2f42-463a-a19f-fc3f1e74c1f2', 'anag',     '$argon2id$v=19$m=65536,t=3,p=4$A6ndB+3u507gdyER55AuwQ$Mi7UmYt4zd5gTYn5Rt+UoLhbs5gP+IT67jBNpS/fpwo', 'https://example.com/images/anag.jpg'),
('b7383b8d-8586-4f46-898e-2a7ce4b21497', 'carlitos', '$argon2id$v=19$m=65536,t=3,p=4$6jI8xJcECufCCi7+4qqZ4A$uNMSLBkSdEPcDzxNXdua54b4E8cu0eC5n69hdv4VihA', 'https://example.com/images/carlitos.jpg');




-- Insertar chats (usando los UUIDs correctos)
INSERT INTO chats (id, user_id1, user_id2) VALUES
(1, 'd6b3e21a-5f0f-4e19-b2d6-7a4c95a1fd01', 'a4210b9e-2f42-463a-a19f-fc3f1e74c1f2'),  -- juanp <-> anag
(2, 'd6b3e21a-5f0f-4e19-b2d6-7a4c95a1fd01', 'b7383b8d-8586-4f46-898e-2a7ce4b21497');  -- juanp <-> carlitos


INSERT INTO mensajes (id, chat_id, user_id, descripcion, fecha) VALUES
(1, 1, 'd6b3e21a-5f0f-4e19-b2d6-7a4c95a1fd01', 'Hola Ana!', '2025-04-16 18:15:00'),
(2, 1, 'a4210b9e-2f42-463a-a19f-fc3f1e74c1f2', '¡Hola Juan! ¿Cómo estás?', '2025-04-16 18:16:00'),
(3, 2, 'b7383b8d-8586-4f46-898e-2a7ce4b21497', '¡Ey Juan! ¿Jugamos hoy?', '2025-04-16 18:17:00'),
(4, 2, 'd6b3e21a-5f0f-4e19-b2d6-7a4c95a1fd01', 'Dale, tipo 7', '2025-04-16 18:18:00');

