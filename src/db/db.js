const mysql2 = require('mysql2');

// Datos para la conexión con la DB
const conexion = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456'
});

// Función para crear una tabla
function createTable(query, tableName) {
    return new Promise((resolve, reject) => {
        conexion.query(query, (err, results) => {
            if (err) {
                console.error(`Error creando la tabla ${tableName}:`, err);
                reject(err);
                return;
            }
            console.log(`Tabla ${tableName} asegurada - Creada exitosamente`);
            resolve(results);
        });
    });
}

// Función para cambiar la base de datos
function changeDatabase(databaseName) {
    return new Promise((resolve, reject) => {
        conexion.changeUser({ database: databaseName }, (err) => {
            if (err) {
                console.error(`Error al cambiar a la base de datos ${databaseName}:`, err);
                reject(err);
                return;
            }
            console.log(`Cambiado a la base de datos ${databaseName}`);
            resolve();
        });
    });
}

// Función para listar las bases de datos
function listDatabases() {
    return new Promise((resolve, reject) => {
        conexion.query('SHOW DATABASES;', (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });
}

// Función para inicializar la base de datos
async function initializeDatabase() {
    try {
        await createTable('CREATE DATABASE IF NOT EXISTS kinesiologia_db', 'kinesiologia_db');
        const databases = await listDatabases();
        console.log('Bases de datos disponibles:', databases);
        await changeDatabase('kinesiologia_db');

        // Definición de los queries de creación de tablas
        const tableQueries = [
            {
                query: `
                    CREATE TABLE IF NOT EXISTS sexo (
                        sexo_id INT AUTO_INCREMENT PRIMARY KEY,
                        sexo_descripcion VARCHAR(50) NOT NULL
                    );`,
                name: 'sexo'
            },
            {
                query: `
                    CREATE TABLE IF NOT EXISTS contacto (
                        contacto_id INT AUTO_INCREMENT PRIMARY KEY,
                        id_sexo INT NOT NULL,
                        contacto_nombre VARCHAR(50) NOT NULL,
                        contacto_apellido VARCHAR(50) NOT NULL,
                        contacto_email VARCHAR(100) NOT NULL,
                        contacto_telefono BIGINT NOT NULL,
                        contacto_mensaje VARCHAR(240) NOT NULL,
                        contacto_provincia VARCHAR(100) NOT NULL,
                        contacto_municipio VARCHAR(100) NOT NULL,
                        FOREIGN KEY (id_sexo) REFERENCES sexo(sexo_id)
                    );`,
                name: 'contacto'
            },
            {
                query: `
                    CREATE TABLE IF NOT EXISTS kinesiologo (
                        kinesiologo_id INT AUTO_INCREMENT PRIMARY KEY,
                        kinesiologo_nombre VARCHAR(50) NOT NULL,
                        kinesiologo_apellido VARCHAR(50) NOT NULL,
                        kinesiologo_email VARCHAR(100) NOT NULL,
                        kinesiologo_telefono BIGINT NOT NULL 
                    );`,
                name: 'kinesiologo'
            },
            {
                query: `
                    CREATE TABLE IF NOT EXISTS rol (
                        rol_id INT AUTO_INCREMENT PRIMARY KEY,
                        rol_descripcion VARCHAR(50) NOT NULL
                    );`,
                name: 'rol'
            },
            {
                query: `
                    CREATE TABLE IF NOT EXISTS usuario (
                        usuario_id INT AUTO_INCREMENT PRIMARY KEY,
                        usuario_nombre VARCHAR(50) NOT NULL,
                        usuario_apellido VARCHAR(50) NOT NULL,
                        usuario_email VARCHAR(100) NOT NULL,
                        usuario_contrasenia VARCHAR(100) NOT NULL,
                        usuario_telefono BIGINT NOT NULL,
                        usuario_provincia VARCHAR(100) NOT NULL,
                        usuario_localidad VARCHAR(100) NOT NULL,
                        id_sexo INT NOT NULL,
                        id_rol INT NOT NULL,
                        FOREIGN KEY (id_sexo) REFERENCES sexo(sexo_id),
                        FOREIGN KEY (id_rol) REFERENCES rol(rol_id)
                    );`,
                name: 'usuario'
            },
            {
                query: `
                    CREATE TABLE IF NOT EXISTS turno (
                        turno_id INT AUTO_INCREMENT PRIMARY KEY,
                        id_paciente INT NOT NULL,
                        id_kinesiologo INT NOT NULL,
                        turno_fecha DATE NOT NULL
                    );`,
                name: 'turno'
            }
        ];

        // Creación de las tablas
        for (let table of tableQueries) {
            await createTable(table.query, table.name);
        }

        console.log('Todas las tablas han sido creadas exitosamente');
    } catch (error) {
        console.error('Ocurrió un error durante la creación de las tablas:', error);
    } finally {
        conexion.end();
    }
}

module.exports = { initializeDatabase };