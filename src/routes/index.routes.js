//Importamos el modulo de express y usamos especificamente la parte de control y manejo de rutas
const express = require('express');
const router = express.Router();
const controller = require('../controller/index.controller');
const authController = require('../controller/auth.controller');

//---Router para las vistas(GET)---
//Controlador de la ruta principal
router.get('/', controller.index);
//Controlador de la ruta contactanos
router.get('/contactanos', controller.contactanos);
//Controlador de la ruta quienesSomos
router.get('/quienesSomos', controller.quienesSomos);
//Controlador de la ruta de registro
router.get('/register', controller.register);
//Controlador de login
router.get('/login', controller.login);
//Controlador de Admin
router.get('/admin', authController.isAuthenticated, controller.admin);

//---Router para las acciones(POST)---
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/admin/logout', authController.logout);

//Exportamos todo lo que este en router
module.exports = router;