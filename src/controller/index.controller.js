//Inicializamos el controlador => como un objeto vacio
const controller = {}
const path = require('path');
const conexion = require('../db/conexion.db');

//Implementacion de la ruta principal
controller.index = (req,res) => {
    res.render('index');
};
//Ruta contactanos
controller.contactanos = (req, res) => {
    res.render('contactanos');
};
//Ruta quienesSomos
controller.quienesSomos = (req,res) => {
    res.render('quienesSomos');
};
//Ruta register
controller.register = (req,res) => {
    res.render('register');
};
//Ruta login => por defecto no le pasamos ningun valor al alert
controller.login = (req,res) => {
    res.render('login', {alert: false});
};

module.exports = controller;