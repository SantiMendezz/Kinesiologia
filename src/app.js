const express = require('express'); // Importa el módulo express => en una funcion
const cookieParser = require('cookie-parser');
// const dotenv = require('dotenv');
const path = require('path'); //Se encarga de normalizar rutas
const { initializeDatabase } = require('./db/db');
const {PORT} = require('./db/config');

const app = express(); // Crea una aplicación express => instanciacion de la funcion express en la variable app

// Configuración del directorio donde se encuentran las vistas EJS
app.set('views', path.join(__dirname, '../public'));
// Set al motor de plantillas
app.set('view engine', 'ejs');

//Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Set para que node procese archivos estaticos
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Cookies
app.use(cookieParser());

//Lineas comentadas para uso en railway
//Descomentar las siguientes lineas para poder usar la BD de manera local
// (async () => {
//     await initializeDatabase();
// })();

//ROUTES
// app.use(require('./routes/index.routes.js')); // Otra forma de importar las rutas
const routes = require('./routes/index.routes');
app.use('/' , routes);

//Para eliminar el cache y que no se pueda volver con el boton de back luego de que hacemos un LOGOUT
app.use(function(req, res, next) {
    if(!req.usuario)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
    
})

// Inicia el servidor
// app.listen(PORT, () => {
//     console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
// });
app.listen(PORT);