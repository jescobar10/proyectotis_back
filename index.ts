import Server from './classes/server';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

//Modulos 
import userRoutes from './routes/usuario';
import avanceObraRoutes from './routes/avanceObra'; 

import cors from 'cors';
import clienteRoutes from './routes/cliente';
import materialRoutes from './routes/material';
import obraRoutes from './routes/obra';
import proveedorRoutes from './routes/proveedor';
import trabajadorRoutes from './routes/trabajador';

const server = new Server();

//Body Parse : Para interprestar los post, get, etc
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json());

//Configuración del CORS
server.app.use( cors({ origin: true, credentials: true }) );

//Definición de las rutas
server.app.use('/user', userRoutes );
server.app.use('/avanceObra', avanceObraRoutes );
server.app.use('/cliente', clienteRoutes );
server.app.use('/material', materialRoutes );
server.app.use('/obra', obraRoutes );
server.app.use('/proveedor', proveedorRoutes );
server.app.use('/trabajador', trabajadorRoutes );

//Conectar con base de datos
//mongodb+srv://proyectotis_back:<password>@clustertis.jurio.mongodb.net/<dbname>?retryWrites=true&w=majority
//mongoose.connect('mongodb://localhost:27017/bdtis', 
mongoose.connect('mongodb+srv://proyectotis_back:Tis2020@clustertis.jurio.mongodb.net/<bdtis>?retryWrites=true&w=majority', 
{
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, ( err ) => {

        if ( err ) throw err;

        console.log('Base de datos ON LINE - Corriendo en la Nube Atlas.');
    });

//Se levanta express
server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.port }`); 

} );


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://proyectotis_back:<password>@clustertis.jurio.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });