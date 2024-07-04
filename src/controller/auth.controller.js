const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../db/conexion.db');
const { promisify } = require('util');
const authController = {};

authController.register = async (req, res) => {
    try {
        const { nombres, apellidos, email, contrasenia, telefono, sexo } = req.body;
        let passHash = await bcryptjs.hash(contrasenia, 8);

        const query = 'INSERT INTO usuario SET ?';
        const values = {
            usuario_nombre: nombres,
            usuario_apellido: apellidos,
            usuario_email: email,
            usuario_contrasenia: passHash,
            usuario_telefono: telefono,
            id_sexo: sexo,
            id_rol: 1
        };

        // Usar la conexión de pool para ejecutar la consulta
        const connection = await conexion.getConnection();
        try {
            await connection.query(query, values);
            console.log('Usuario registrado correctamente');
            res.redirect('/');
        } catch (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.redirect('/');
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool
        }
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};

module.exports = authController;