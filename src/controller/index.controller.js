//Inicializamos el controlador => como un objeto vacio
const controller = {}
const path = require('path');

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
//Ruta admin
controller.admin = (req,res) => {
    res.render('./admin/admin', {usuario:req.usuario});
};

module.exports = controller;