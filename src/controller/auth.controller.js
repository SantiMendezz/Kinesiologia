const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../db/conexion.db');
const authController = {};
//Modulo de encriptacion
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
//Convierte funciones de callback en otras que devuelven promesas
const {promisify} = require('util');

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

authController.login = async (req, res) => {
    try {
        const email = req.body.email;
        const pass = req.body.contrasenia;
        if(!email || !pass) {
            return res.render('login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y una contraseña",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }

        console.log(`Contraseña ingresada: ${pass}`);
        
        //Mysql2 -> no maneja callbacks pero si promesas
        //Consulta usando promesas
        const [results] = await conexion.query('SELECT * FROM usuario WHERE usuario_email = ?', [email]);

        if (results.length == 0) {
            console.log('No se encontró el usuario con el email proporcionado');
            return res.render('login', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Usuario y/o contraseña incorrectas",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            });
        }

        console.log(`Contraseña ingresada: ${pass} y contraseña almacenada: ${results[0].usuario_contrasenia}`);

        const passwordMatch = await bcryptjs.compare(pass, results[0].usuario_contrasenia);

        if (!passwordMatch) {
            console.log('La contraseña no coincide');
            return res.render('login', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Usuario y/o contraseña incorrectas",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            });
        }

        //Inicio de sesión OK
        const id = results[0].usuario_id;
        const token = jwt.sign({id:id}, secretKey, {expiresIn: '7d'});
        console.log(`Token ${token} para el usuario ${email}`);

        //Opciones de cookie
        const cookiesOptions = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        //El primero es el nombre que va a tener la cookie
        res.cookie('jwt', token, cookiesOptions);
        return res.render('login', {
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "¡LOGIN CORRECTO!",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 800,
            ruta: 'admin'
        });

    } catch (error) {
        console.error('Error en el bloque try-catch:', error);
        return res.render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Error del servidor",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
    }
    
    // try {
    //     const { email, contrasenia } = req.body;

    //     if (email && contrasenia) {
    //         const connection = await conexion.getConnection();
    //         try {
    //             const [results] = await connection.query('SELECT * FROM usuario WHERE usuario_email = ?', [email]);

    //             if (results.length > 0) {
    //                 const user = results[0];
    //                 const isMatch = await bcryptjs.compare(contrasenia, user.usuario_contrasenia);
    //                 if (isMatch) {
    //                     const id = user.usuario_id;
    //                     const token = jwt.sign({ id: id }, secretKey, { expiresIn: '5m' });

    //                     console.log(`TOKEN: ${token} para el usuario ${email}`);

    //                     const cookiesOptions = {
    //                         expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    //                         httpOnly: true
    //                     };

    //                     res.cookie('jwt', token, cookiesOptions);
    //                     res.cookie('swalMessage', encodeURIComponent(JSON.stringify({
    //                         title: 'LOGIN Correcto',
    //                         text: 'Conexión exitosa',
    //                         icon: 'success',
    //                         confirmButtonText: 'OK',
    //                         timer: 800
    //                     })));
    //                     return res.redirect('/');
    //                 } else {
    //                     res.cookie('swalMessage', encodeURIComponent(JSON.stringify({
    //                         title: 'Advertencia',
    //                         text: 'Usuario y/o Contraseña Incorrecta',
    //                         icon: 'warning',
    //                         confirmButtonText: 'OK'
    //                     })));
    //                     return res.redirect('/login');
    //                 }
    //             } else {
    //                 res.cookie('swalMessage', encodeURIComponent(JSON.stringify({
    //                     title: 'Advertencia',
    //                     text: 'Usuario y/o Contraseña Incorrecta',
    //                     icon: 'warning',
    //                     confirmButtonText: 'OK'
    //                 })));
    //                 return res.redirect('/login');
    //             }
    //         } catch (error) {
    //             console.error('Error al ejecutar la consulta:', error);
    //             res.cookie('swalMessage', encodeURIComponent(JSON.stringify({
    //                 title: 'Error',
    //                 text: 'Ocurrió un error al procesar su solicitud',
    //                 icon: 'error',
    //                 confirmButtonText: 'OK'
    //             })));
    //             return res.redirect('/login');
    //         } finally {
    //             connection.release();
    //         }
    //     } else {
    //         res.cookie('swalMessage', encodeURIComponent(JSON.stringify({
    //             title: 'Advertencia',
    //             text: 'Por favor ingrese Usuario y Contraseña!',
    //             icon: 'warning',
    //             confirmButtonText: 'OK'
    //         })));
    //         return res.redirect('/login');
    //     }
    // } catch (error) {
    //     console.error(error);
    //     res.cookie('swalMessage', encodeURIComponent(JSON.stringify({
    //         title: 'Error',
    //         text: 'Ocurrió un error inesperado',
    //         icon: 'error',
    //         confirmButtonText: 'OK'
    //     })));
    //     return res.redirect('/login');
    // }
};

authController.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, secretKey);
            const [results] = await conexion.query('SELECT * FROM usuario WHERE usuario_id = ?', [decodificada.id]);
            if(results.length == 0) {
                return next();
            }
            req.usuario = results[0];
            return next();
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        res.redirect('/login');
    }
};

authController.logout = async (req, res) => {
    res.clearCookie('jwt');
    return  res.redirect('/');
};

module.exports = authController;