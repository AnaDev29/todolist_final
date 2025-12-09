
USE todolist_db;


DROP TABLE IF EXISTS Tasks;
DROP TABLE IF EXISTS Users;

--  CREAR TABLA USERS

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  alias VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) UNIQUE,
  contraseña VARCHAR(255) NOT NULL,
  foto VARCHAR(500) DEFAULT NULL,
  refreshToken TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_alias (alias),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--  CREAR TABLA TASKS

CREATE TABLE Tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  userId INT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_completed (completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--  INSERTAR USUARIOS CON CONTRASEÑAS ENCRIPTADAS
-- Contraseñas originales: santi123 y ana123

INSERT INTO Users (nombre, alias, email, contraseña) VALUES
('Santiago Hurtado', 'santi', 'santiago@example.com', '$2a$10$Kry0vYxt/kPmP06QSF5lzOlPtmY0hZMJlWHpXkbZ61ShMEr5TFlKa'),
('Anita', 'ana', 'ana@example.com', '$2a$10$0H6eh6oG1ksZv07I9yzaqeMX76hbNJnuVIfB5L/Po.rq1loJGkqou');


--  INSERTAR TAREAS DE PRUEBA (Santiago = userId 1)

INSERT INTO Tasks (text, completed, userId) VALUES
('Completar el backend de la aplicación', FALSE, 1),
('Configurar base de datos MySQL', TRUE, 1),
('Implementar autenticación JWT', FALSE, 1);


--  INSERTAR TAREAS DE PRUEBA (Ana = userId 2)

INSERT INTO Tasks (text, completed, userId) VALUES
('Revisar documentación', FALSE, 2),
('Testear la aplicación', FALSE, 2);

--  VERIFICAR DATOS

SELECT 'Usuarios creados:' AS Info;
SELECT * FROM Users;

SELECT 'Tareas creadas:' AS Info;
SELECT * FROM Tasks;

