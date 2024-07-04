const mysql = require('mysql2/promise');

async function createDatabase(databaseName) {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            port: 3307
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
        console.log(`Base de datos ${databaseName} asegurada - Creada exitosamente`);
        await connection.end();
    } catch (err) {
        console.error(`Error creando la base de datos ${databaseName}:`, err);
        throw err;
    }
}

// Función para verificar si una tabla existe
async function tableExists(connection, tableName) {
    const query = `SHOW TABLES LIKE '${tableName}';`;
    const [results] = await connection.query(query);
    return results.length > 0;
}

// Función para crear una tabla si no existe
async function createTable(connection, query, tableName) {
    try {
        const exists = await tableExists(connection, tableName);
        if (exists) {
            console.log(`Tabla ${tableName} ya existe`);
        } else {
            await connection.query(query);
            console.log(`Tabla ${tableName} asegurada - Creada exitosamente`);
        }
    } catch (err) {
        console.error(`Error al verificar/crear la tabla ${tableName}:`, err);
        throw err;
    }
}

// Función para listar las bases de datos
async function listDatabases(connection) {
    const [results] = await connection.query('SHOW DATABASES;');
    return results;
}

// Función para inicializar la base de datos
async function initializeDatabase() {
    const databaseName = 'kinesiologia_db';
    let connection;
    
    try {
        // Crear la base de datos si no existe
        await createDatabase(databaseName);

        // Crear una nueva conexión utilizando la base de datos
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            port: 3307,
            database: databaseName
        });

        console.log(`Cambiado a la base de datos ${databaseName}`);

        // Listar las bases de datos
        const databases = await listDatabases(connection);
        console.log('Bases de datos disponibles:', databases);

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
                        turno_fecha DATE NOT NULL,
                        FOREIGN KEY (id_paciente) REFERENCES usuario(usuario_id),
                        FOREIGN KEY (id_kinesiologo) REFERENCES kinesiologo(kinesiologo_id)
                    );`,
                name: 'turno'
            }
        ];

        // Creación de las tablas
        for (let table of tableQueries) {
            await createTable(connection, table.query, table.name);
        }

        console.log('Todas las tablas han sido creadas exitosamente');
    } catch (error) {
        console.error('Ocurrió un error durante la creación de las tablas:', error);
    } finally {
        if (connection) await connection.end();
    }
}

module.exports = { initializeDatabase };