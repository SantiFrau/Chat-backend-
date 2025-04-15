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


-- Tabla de chats (una relación entre dos usuarios)
CREATE TABLE chats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id1 INT NOT NULL,
  user_id2 INT NOT NULL,
  FOREIGN KEY (user_id1) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id2) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT no_self_chat CHECK (user_id1 <> user_id2)
);

-- Tabla de mensajes
CREATE TABLE mensajes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  chat_id INT NOT NULL,
  user_id INT NOT NULL,
  descripcion TEXT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertar usuarios
INSERT INTO users (username, password, img) VALUES
('juan', '1234', 'https://randomuser.me/api/portraits/men/1.jpg'),
('maria', '5678', 'https://randomuser.me/api/portraits/women/2.jpg'),
('lucas', 'abcd', 'https://randomuser.me/api/portraits/men/3.jpg'),
('sofia', 'qwerty', 'https://randomuser.me/api/portraits/women/4.jpg');

-- Insertar chats (juan con maria, lucas con sofia)
INSERT INTO chats (user_id1, user_id2) VALUES
(1, 2), -- Juan y María
(3, 4), -- Lucas y Sofía
(1, 3); -- Juan y Lucas

-- Insertar mensajes
INSERT INTO mensajes (chat_id, user_id, descripcion, fecha) VALUES
(1, 1, '¡Hola María!', '2025-04-13 10:15:00'),
(1, 2, '¡Hola Juan! ¿Cómo estás?', '2025-04-13 10:16:30'),
(1, 1, 'Todo bien, ¿vos?', '2025-04-13 10:17:45'),

(2, 3, '¿Vamos al cine el finde?', '2025-04-12 20:05:00'),
(2, 4, 'Dale, me encanta la idea', '2025-04-12 20:06:10'),

(3, 1, 'Che Lucas, ¿tenés el archivo?', '2025-04-14 09:00:00'),
(3, 3, 'Sí, ahora te lo paso', '2025-04-14 09:01:30');

