"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cliente_model_1 = require("../models/cliente.model");
const token_1 = __importDefault(require("../classes/token"));
const clienteRoutes = express_1.Router();
//Listar clientes paginados
clienteRoutes.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    //Se solicita el numero de pagina , parametro opcional
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const body = req.body;
    const clientes = yield cliente_model_1.Cliente.find()
        //Muestra ordenado por nombre
        .sort({ nombre: 1 })
        .skip(skip)
        //Se pagina de 10 en 10 
        .limit(10)
        .exec();
    res.json({
        ok: true,
        pagina,
        clientes
    });
}));
clienteRoutes.get('/:id', (req, res) => {
    let id = req.params.id;
    cliente_model_1.Cliente.findOne({ identificacion: id }, (err, clienteDB) => {
        if (err)
            throw err;
        if (!clienteDB) {
            return res.json({
                ok: false,
                mensaje: `No existe cliente con identificacion ${id}`
            });
        }
        if (clienteDB.activo) {
            let cliente = {
                _id: clienteDB._id,
                tipo: clienteDB.tipo,
                identificacion: clienteDB.identificacion,
                nombre: clienteDB.nombre,
                telefono: clienteDB.telefono,
                email: clienteDB.email,
                direccion: clienteDB.direccion,
                activo: clienteDB.activo
            };
            res.json({
                ok: true,
                cliente
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: `El cliente con identificacion ${id} no esta activo`
            });
        }
    });
});
//Servicio Crear clientes
clienteRoutes.post('/create', (req, res) => {
    const cliente = {
        tipo: req.body.tipo,
        identificacion: req.body.identificacion,
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        email: req.body.email,
        direccion: req.body.direccion,
        activo: req.body.activo
    };
    //Se crea el cliente en Base de datos
    cliente_model_1.Cliente.create(cliente).then(clienteDB => {
        const tokenUser = token_1.default.getJwtToken({
            _id: clienteDB._id,
            tipo: clienteDB.tipo,
            identificacion: clienteDB.identificacion,
            nombre: clienteDB.nombre,
            telefono: clienteDB.telefono,
            email: clienteDB.email,
            direccion: clienteDB.direccion,
            activo: clienteDB.activo
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//Actualizar proveedor
clienteRoutes.post('/update', (req, res) => {
    console.log("Entro al backEnd");
    //Buscamos que exista el proveedor
    cliente_model_1.Cliente.findById({ _id: req.body._id }, (err, clienteDB) => {
        // Si no se puede procesar el query se arroja un error
        if (err)
            throw err;
        // Si el usuario no existe en la BD no se procede con la petición
        if (!clienteDB) {
            return res.json({
                ok: false,
                mensaje: `No existe el cliente con _id ${req.body._id}`
            });
        }
        ;
        if (((!req.body.activo) || req.body.activo == 'false') && (!clienteDB.activo)) {
            return res.json({
                ok: false,
                mensaje: `El cliente con _id ${req.body._id} no está activo`
            });
        }
        const cliente = {
            //Se debe de entregar para realizar le update
            _id: req.body._id || clienteDB._id,
            tipo: req.body.tipo || clienteDB.tipo,
            //LLave primararia no se actualiza 
            identificacion: clienteDB.identificacion,
            nombre: req.body.nombre || clienteDB.nombre,
            telefono: req.body.telefono || clienteDB.telefono,
            email: req.body.email || clienteDB.email,
            direccion: req.body.direccion || clienteDB.direccion,
            activo: req.body.activo || clienteDB.activo,
        };
        console.log(cliente);
        cliente_model_1.Cliente.updateOne({ _id: req.body._id }, cliente, { new: true }, (err, clienteUpdated) => {
            if (err)
                throw err;
            const tokenCliente = token_1.default.getJwtToken({
                _id: cliente._id,
                tipo: cliente.tipo,
                identificacion: cliente.identificacion,
                nombre: cliente.nombre,
                telefono: cliente.telefono,
                email: cliente.email,
                direccion: cliente.direccion,
                activo: cliente.activo
            });
            res.json({
                ok: true,
                mensaje: `Se ha actualizado el cliente con documento ${cliente.identificacion}`,
                token: tokenCliente
            });
        });
    });
});
//Se exporta la ruta de Clientes
exports.default = clienteRoutes;
