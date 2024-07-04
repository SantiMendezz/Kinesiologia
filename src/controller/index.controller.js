//Inicializamos el controlador => como un objeto vacio
const controller = {}
const path = require('path');

//Implementacion de la ruta principal
controller.index = (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
};
//Ruta contactanos
controller.contactanos = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/contactanos.html'));
};
//Ruta quienesSomos
controller.quienesSomos = (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/quienesSomos.html'));
};
//Ruta register
controller.register = (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/register.html'));
};
//Ruta login
controller.login = (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/login.html'));
};
//Ruta admin
controller.admin = (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/admin/admin.html'));
};

module.exports = controller;