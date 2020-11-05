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
    const clientes = yield cliente_model_1.Cliente.find({ activo: body.activo })
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
//Actualizar Cliente
clienteRoutes.post('/update', (req, res) => {
    //userRoutes.post('/update', verificaToken,  (req: any, res: Response) => {
    const cliente = {
        tipo: req.body.tipo || req.cliente.tipo,
        identificacion: req.body.identificacion || req.cliente.identificacion,
        nombre: req.body.nombre || req.cliente.nombre,
        telefono: req.body.telefono || req.cliente.telefono,
        email: req.body.email || req.cliente.email,
        direccion: req.body.direccion || req.cliente.direccion,
        activo: req.body.obra || req.cliente.obra
    };
    // Se entrega la información para actualizar 
    cliente_model_1.Cliente.findByIdAndUpdate(req.trabajador._id, cliente, { new: true }, (err, clienteDB) => {
        if (err)
            throw err;
        if (!clienteDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un cliente con ese ID'
            });
        }
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
    });
});
//Eliminar Cliente
//En este caso no se eliminara el registro si no que se pondra en un estado de inactivo
clienteRoutes.post('/delete', (req, res) => {
    //userRoutes.post('/delete', verificaToken,  (req: any, res: Response) => {
    const cliente = {
        _id: req.body._id || req.cliente._id,
        activo: req.body.activo || req.cliente.activo
    };
    // Se entrega la información para actualizar el campo activo a false
    cliente_model_1.Cliente.findByIdAndUpdate(req.trabajador._id, cliente, { new: true }, (err, clienteDB) => {
        if (err)
            throw err;
        if (!clienteDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un cliente con ese ID'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: clienteDB._id,
            documento: clienteDB.identificacion,
            activo: false
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
//Se exporta la ruta de Clientes
exports.default = clienteRoutes;
