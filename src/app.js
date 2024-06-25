const express = require('express'); // Importa el módulo express => en una funcion
const app = express(); // Crea una aplicación express => instanciacion de la funcion express en la variable app
const path = require('path'); //Se encarga de normalizar rutas

//Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

//ROUTES
// app.use(require('./routes/index.routes.js')); // Otra forma de importar las rutas
const routes = require('./routes/index.routes');
app.use('/' , routes);

// Inicia el servidor
const PORT = 3000; // Define el puerto en el que se ejecutará la aplicación
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
