//Importamos el modulo de express y usamos especificamente la parte de control y manejo de rutas
const express = require('express');
const router = express.Router();
const controller = require('../controller/index.controller');

//Controlador de la ruta principal
router.get('/', controller.index);
//Controlador de la ruta contactanos
router.get('/contactanos', controller.contactanos);
//Controlador de la ruta quienesSomos
router.get('/quienesSomos', controller.quienesSomos);

//Exportamos todo lo que este en router
module.exports = router;