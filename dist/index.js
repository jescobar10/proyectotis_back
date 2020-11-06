"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
//Modulos 
const usuario_1 = __importDefault(require("./routes/usuario"));
const avanceObra_1 = __importDefault(require("./routes/avanceObra"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
//Body Parse : Para interprestar los post, get, etc
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//Configuración del CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
//Definición de las rutas
server.app.use('/user', usuario_1.default);
server.app.use('/avanceObra', avanceObra_1.default);
//Conectar con base de datos
mongoose_1.default.connect('mongodb://localhost:27017/bdtis', {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
}, (err) => {
    if (err)
        throw err;
    console.log('Base de datos ON LINE');
});
//Se levanta express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
