const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
//servidor para inicializar con express

const PORT = process.env.PORT || 3000;

//para poder aplicar el MVC necesitamos un intermediario que se va a encargar de ser un mesero (middleware), el cual para cada peticion que pasa por la ruta de la vista, obtiene una petición y la envia a un controlador
app.use(cors());

//las peticiones las debemos de atender en un formato JSON, lo que permite poder detectar los elementos bajo los criterios clave, valor
app.use(express.json());

//que se debe de tener una ruta personalizada por cada tipo de petición next es la ruta a la cual se va atender el tipo de petión o de respuesta
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

//debemos definir las rutas para los archivos
app.use(express.static(path.join(__dirname, '..', 'public')));

//vamos a manejar las rutas de los recursos que se van a obtener por medio de las peticiones o respuestas
const usuariosRouter = require('./Routers/usuarios');
const productosRouter = require('./Routers/productos');
const comprasRouter = require('./Routers/compras');
const zonasRouter = require('./Routers/zonas');
const jefesRouter = require('./Routers/jefes'); // <-- ¡1. IMPORTAR ENRUTADOR DE JEFES!

app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/compras', comprasRouter);
app.use('/api/zonas', zonasRouter);
app.use('/api/jefes', jefesRouter); // <-- ¡2. AGREGAR LA RUTA PARA JEFES!


//vamos a documentar cada endpoint
app.get('/api', (req, res) => {
    res.json({
        status : 'success',
        message : 'API REST ',
        endpoint : {
            usuarios : {
                listar : 'GET /api/usuarios',
                obtener : 'GET /api/usuarios/:id',
                crear : 'POST /api/usuarios',
                actualizar : 'PUT /api/usuarios/:id',
                eliminar : 'DELETE /api/usuarios/:id'
            },
            productos : {
                listar : 'GET /api/productos',
                obtener : 'GET /api/productos/:id',
                crear : 'POST /api/productos',
                actualizar : 'PUT /api/productos/:id',
                eliminar : 'DELETE /api/productos/:id'
            },
            compras : {
                listar : 'GET /api/compras',
                obtener : 'GET /api/compras/:id',
                crear : 'POST /api/compras',
                actualizar : 'PUT /api/compras/:id',
                eliminar : 'DELETE /api/compras/:id'
            },
            zonas : {
                listar : 'GET /api/zonas',
                obtener : 'GET /api/zonas/:id',
                crear : 'POST /api/zonas',
                actualizar : 'PUT /api/zonas/:id',
                eliminar : 'DELETE /api/zonas/:id'
            },
            jefes : { // <-- ¡3. AGREGAR JEFES A LA DOCUMENTACIÓN!
                listar : 'GET /api/jefes',
                obtener : 'GET /api/jefes/:id',
                crear : 'POST /api/jefes',
                actualizar : 'PUT /api/jefes/:id',
                eliminar : 'DELETE /api/jefes/:id'
            }
        }
    });
});

//vamos a crear una funcion para las rutas inexistentes
app.use('/api/*path', (req, res) => {
    res.status(404).json({
        status : 'error',
        message : 'Ruta no encontrada'
    });
});

//necesitamos un manejador de errores
app.use((err, req, res, next) =>{
    console.log('error no manejado: ', err.message);
    res.status(500).json({
        status : 'error',
        message : 'Error interno del servidor'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto ${PORT}`);
});