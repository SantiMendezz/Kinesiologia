//Importamos el modulo de express y usamos especificamente la parte de control y manejo de rutas
const express = require('express');
const router = express.Router();
const controller = require('../controller/index.controller');
const authController = require('../controller/auth.controller');
const kineController = require('../controller/kine.controller');

//---Router para las vistas(GET)---
//Controlador de la ruta principal
router.get('/', controller.index);
//Controlador de la ruta contactanos
// router.get('/contactanos', controller.contactanos);
//Controlador de la ruta quienesSomos
router.get('/quienesSomos', controller.quienesSomos);
//Controlador de la ruta de registro
router.get('/register', controller.register);
//Controlador de login
router.get('/login', controller.login);
//Controlador de Admin
router.get('/admin', authController.isAuthenticated, kineController.list);

//---Router para las acciones(POST)---
router.post('/register', authController.register);
router.post('/login', authController.login);

//---Router para admin---
router.get('/admin/logout', authController.logout);
router.get('/admin/update/:id', kineController.edit);
router.post('/admin/update/:id', kineController.update);
router.get('/admin/delete/:id', kineController.delete);
router.post('/admin/add', kineController.save);

//Exportamos todo lo que este en router
module.exports = router;