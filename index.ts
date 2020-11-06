import Server from './classes/server';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

//Modulos 
import userRoutes from './routes/usuario';
import avanceObraRoutes from './routes/avanceObra'; 

import cors from 'cors';

const server = new Server();

//Body Parse : Para interprestar los post, get, etc
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json());

//Configuración del CORS
server.app.use( cors({ origin: true, credentials: true }) );

//Definición de las rutas
server.app.use('/user', userRoutes );
server.app.use('/avanceObra', avanceObraRoutes );

//Conectar con base de datos
mongoose.connect('mongodb://localhost:27017/bdtis', 
{
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, ( err ) => {

        if ( err ) throw err;

        console.log('Base de datos ON LINE');
    });

//Se levanta express
server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.port }`); 

} );


