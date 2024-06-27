const express = require('express'); // Importa el módulo express => en una funcion
const app = express(); // Crea una aplicación express => instanciacion de la funcion express en la variable app
const path = require('path'); //Se encarga de normalizar rutas
const { initializeDatabase } = require('./db/db');

// Conexión con la base de datos e inicialización
initializeDatabase()
    .then(() => {
        console.log('Inicialización de la base de datos completada.');
    })
    .catch((err) => {
        console.error('Error durante la inicialización de la base de datos:', err);
    });

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
