const conexion = require('../db/conexion.db');
const kineController = {};

kineController.list = async (req, res) => {
    try {
        const query = 'SELECT * FROM kinesiologo';
        const connection = await conexion.getConnection();
        try {
            const [results] = await connection.query(query);
            //console.log(results);
            // Renderizar la vista EJS y pasar los resultados
            res.render('./admin/admin', { usuario: req.usuario, data: results });
        } catch (error) {
            console.log(`Error al momento de realizar la consulta de listar en la base de datos: ${error}`);
            res.status(500).send('Error en la consulta a la base de datos');
        } finally {
            connection.release(); // Liberar la conexión
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al conectarse a la base de datos');
    }
};

kineController.edit = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM kinesiologo where kinesiologo_id = ?';
    const connection = await conexion.getConnection();
    try {
        const [results] = await connection.query(query,[id]);
        if(results.length > 0) {
            res.render('./admin/kine_edit', { data: results[0] });
        }
    } catch (error) {
        console.log(`Error al capturar los datos: ${error}`)
    } finally {
        connection.release();
    }
};

kineController.update = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email, telefono } = req.body;

    const query = 'UPDATE kinesiologo SET kinesiologo_nombre = ?, kinesiologo_apellido = ?, kinesiologo_email = ?, kinesiologo_telefono = ? WHERE kinesiologo_id = ?';

    try {
        const connection = await conexion.getConnection();

        try {
            await connection.query(query, [nombre, apellido, email, telefono, id]);
            res.redirect('/admin');
        } catch (error) {
            console.error(`Error al momento de realizar la actualización en la base de datos: ${error}`);
            res.status(500).send('Error en la actualización a la base de datos');
        } finally {
            connection.release();
        }
    } catch (error) {
        console.log(`Error al conectarse a la base de datos ${error}`);
        res.status(500).send(`Error al conectarse a la base de datos`);
    }
};

kineController.delete = async (req,res) => {
    const { id } = req.params;
    const query = 'DELETE FROM kinesiologo WHERE kinesiologo_id = ?';
    try {
        const connection = await conexion.getConnection();
        try {
            await connection.query(query,[id]);
            res.redirect('/admin');
        } catch (error) {
            console.log(`Error al eliminar el registro de la base de datos ${error}`);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.log(`Error al conectarse a la base de datos ${error}`);
        res.status(500).send(`Error al conectarse a la base de datos`);
    }
}

kineController.save = async (req,res) => {
    const { nombre, apellido, email, telefono } = req.body;
    const query = 'INSERT INTO kinesiologo (kinesiologo_nombre,kinesiologo_apellido,kinesiologo_email,kinesiologo_telefono) values (?,?,?,?)';
    try {
        const connection = await conexion.getConnection();
        try {
            await connection.query(query,[nombre,apellido,email,telefono]);
            res.redirect('/admin');
        } catch (error) {
            console.log(`Error al agregar el registro de la base de datos ${error}`);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.log(`Error al conectarse a la base de datos ${error}`);
        res.status(500).send(`Error al conectarse a la base de datos`);
    }
}

module.exports = kineController;