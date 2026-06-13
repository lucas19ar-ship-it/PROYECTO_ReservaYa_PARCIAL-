
-- CREAMOS LA BASE DE DATOS -- 
CREATE DATABASE ReservaYa; 
USE ReservaYa; 

-- CREAMOS LAS TABLAS -- 
-- CLIENTES -- 
CREATE TABLE clientes (
	id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, 
    telefono VARCHAR(9), 
    correo VARCHAR(100) UNIQUE, 
	fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- MESAS -- 
CREATE TABLE mesas (
	id_mesa INT AUTO_INCREMENT PRIMARY KEY,
    numero_mesa INT NOT NULL UNIQUE,
    capacidad INT NOT NULL, 
    ubicacion VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'Disponible'    
); 


-- ESTADOS DE RESERVA -- 
CREATE TABLE estados_reserva (
    id_estado INT AUTO_INCREMENT PRIMARY KEY,
    nombre_estado VARCHAR(30) NOT NULL UNIQUE
); 

-- USUARIOS -- 
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('Administrador', 'Cliente') NOT NULL 
); 


-- RESERVAS -- 
CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY, 
    id_cliente INT NOT NULL, 
    id_mesa INT NOT NULL, 
    id_estado INT NOT NULL, 
    id_usuario INT NOT NULL, 
    
    fecha_reserva DATE NOT NULL, 
    hora_reserva TIME NOT NULL, 
    cantidad_personas INT NOT NULL CHECK(cantidad_personas > 0),
	fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente),
        
	FOREIGN KEY (id_mesa)
        REFERENCES mesas(id_mesa),
        
	FOREIGN KEY (id_estado)
        REFERENCES estados_reserva(id_estado),
        
    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
); 


-- ===================================
-- INSERCCIÓN DE DATOS A LAS TABLAS 
-- ===================================
-- DATOS DE MESAS  --
INSERT INTO mesas(numero_mesa, capacidad) 
VALUES 
(1,2),
(2,4),
(3,4),
(4,6),
(5,8);


-- DATOS DE CLIENTES -- 
INSERT INTO clientes(nombre, telefono, correo)
VALUES 
('Juan Perez','987654321','juan@gmail.com'),
('Maria Torres','999888777','maria@gmail.com');


-- DATOS EN ESTADOS DE RESERVA --
INSERT INTO estados_reserva(nombre_estado)
VALUES
('Pendiente'),
('Confirmada'),
('Cancelada'),
('Finalizada');  

-- DATOS DE USUARIOS -- 
INSERT INTO usuarios(
	nombre_usuario,
    contrasena,
    rol
)
VALUES
(
    'admin',
    'admin123',
    'Administrador'
);  

-- DATOS DE RESERVAS -- 
INSERT INTO reservas(
id_cliente,
id_mesa,
id_estado,
id_usuario,
fecha_reserva,
hora_reserva,
cantidad_personas
)
VALUES
(
1,
2,
1,
1,
'2026-08-20',
'19:00:00',
4
);



-- ===============================
-- CONSULTAS 
-- ===============================

-- VER RESERVAS  -- 
SELECT 
    r.id_reserva, 
    c.nombre AS cliente,
    m.numero_mesa, 
    e.nombre_estado,
    u.nombre_usuario AS administrador,
    r.fecha_reserva,
    r.hora_reserva, 
    r.cantidad_personas 
FROM reservas r 
INNER JOIN clientes c 
    ON r.id_cliente = c.id_cliente
INNER JOIN mesas m 
    ON r.id_mesa = m.id_mesa
INNER JOIN estados_reserva e
    ON r.id_estado = e.id_estado 
INNER JOIN usuarios u 
    ON r.id_usuario = u.id_usuario; 

-- BUSCAR RESERVAS POR FECHA-- 
SELECT *
FROM reservas 
WHERE fecha_reserva = '2026-08-20'; 

-- ACTUALIZAR RESERVA -- 
UPDATE reservas 
SET hora_reserva = '20:00:00'
WHERE id_reserva = 1; 

-- ELIMINAR RESERVA -- 
DELETE FROM reservas 
WHERE id_reserva =1; 

-- RESERVAS DE HOY-- 
SELECT COUNT(*) AS reservas_hoy
FROM reservas 
WHERE fecha_reserva = CURDATE();

-- MESAS OCUPADAS HOY -- 
SELECT COUNT(DISTINCT id_mesa) AS mesas_ocupadas 
FROM reservas 
WHERE fecha_reserva = CURDATE();




