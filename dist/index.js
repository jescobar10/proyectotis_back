"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
//Imortación para subir imagenes y pdfs
const express_fileupload_1 = __importDefault(require("express-fileupload"));
//Modulos 
const usuario_1 = __importDefault(require("./routes/usuario"));
const avanceObra_1 = __importDefault(require("./routes/avanceObra"));
const cors_1 = __importDefault(require("cors"));
const cliente_1 = __importDefault(require("./routes/cliente"));
const material_1 = __importDefault(require("./routes/material"));
const obra_1 = __importDefault(require("./routes/obra"));
const proveedor_1 = __importDefault(require("./routes/proveedor"));
const trabajador_1 = __importDefault(require("./routes/trabajador"));
const materialEntrada_1 = __importDefault(require("./routes/materialEntrada"));
const materialSalida_1 = __importDefault(require("./routes/materialSalida"));
const trabajador_obra_1 = __importDefault(require("./routes/trabajador_obra"));
const server = new server_1.default();
const port = process.env.PORT || 3001;
//Body Parse : Para interprestar los post, get, etc
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//FileUpload  -  Subir Imagenes y PDF
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
//server.app.use( fileUpload() );
//Configuración del CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
//Definición de las rutas
server.app.use('/user', usuario_1.default);
server.app.use('/avanceObra', avanceObra_1.default);
server.app.use('/cliente', cliente_1.default);
server.app.use('/material', material_1.default);
server.app.use('/obra', obra_1.default);
server.app.use('/proveedor', proveedor_1.default);
server.app.use('/trabajador', trabajador_1.default);
server.app.use('/materialentrada', materialEntrada_1.default);
server.app.use('/materialsalida', materialSalida_1.default);
server.app.use('/trabajadorobra', trabajador_obra_1.default);
//Conectar con base de datos
//mongodb+srv://proyectotis_back:<password>@clustertis.jurio.mongodb.net/<dbname>?retryWrites=true&w=majority
//mongoose.connect('mongodb://localhost:27017/bdtis',  
mongoose_1.default.connect('mongodb+srv://proyectotis_back:Tis2020@clustertis.jurio.mongodb.net/<bdtis>?retryWrites=true&w=majority', {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
}, (err) => {
    if (err)
        throw err;
    console.log('Base de datos ON LINE - Corriendo en la Nube Atlas.');
});
//Se levanta express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${port}`);
});
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://proyectotis_back:<password>@clustertis.jurio.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
