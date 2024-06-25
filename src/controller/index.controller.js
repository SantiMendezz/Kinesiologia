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
    res.sendFile(path.join(__dirnmae, '../../public/quienesSomos.html'));
};

module.exports = controller;