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
const proveedor_model_1 = require("../models/proveedor.model");
const token_1 = __importDefault(require("../classes/token"));
const proveedorRoutes = express_1.Router();
//Listar Proveedor paginados
proveedorRoutes.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    //Se solicita el numero de pagina , parametro opcional
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const body = req.body;
    const proveedores = yield proveedor_model_1.Proveedor.find({ activo: body.activo })
        //Muestra ordenado por nombre
        .sort({ nombre: 1 })
        .skip(skip)
        //Se pagina de 10 en 10 
        .limit(10)
        .exec();
    res.json({
        ok: true,
        pagina,
        proveedores
    });
}));
//Servicio Crear Proveedor
proveedorRoutes.post('/create', (req, res) => {
    const proveedor = {
        tipo: req.body.tipo,
        identificacion: req.body.identicacion,
        nombre: req.body.nombre,
        repreLegal: req.body.repreLegal,
        telefono: req.body.telefono,
        email: req.body.email,
        direccion: req.body.direccion,
        activo: req.body.activo
    };
    //Se crea el proveedor en Base de datos
    proveedor_model_1.Proveedor.create(proveedor).then(proveedorDB => {
        const tokenUser = token_1.default.getJwtToken({
            _id: proveedorDB._id,
            tipo: proveedorDB.tipo,
            identificacion: proveedorDB.identificacion,
            nombre: proveedorDB.nombre,
            repreLegal: proveedorDB.repreLegal,
            telefono: proveedorDB.telefono,
            email: proveedorDB.email,
            direccion: proveedorDB.direccion,
            activo: proveedorDB.activo
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
proveedorRoutes.post('/update', (req, res) => {
    //userRoutes.post('/update', verificaToken,  (req: any, res: Response) => {
    const proveedor = {
        tipo: req.body.tipo || req.proveedor.tipo,
        identificacion: req.body.identificacion || req.proveedor.identificacion,
        nombre: req.body.nombre || req.proveedor.nombre,
        repreLegal: req.body.repreLegal || req.trabajador.repreLegal,
        telefono: req.body.telefono || req.trabajador.telefono,
        email: req.body.email || req.trabajador.email,
        direccion: req.body.direccion || req.trabajador.direccion,
        activo: req.body.activo || req.trabajador.activo
    };
    // Se entrega la información para actualizar 
    proveedor_model_1.Proveedor.findByIdAndUpdate(req.proveedor._id, proveedor, { new: true }, (err, proveedorDB) => {
        if (err)
            throw err;
        if (!proveedorDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un proveedor con ese ID'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: proveedorDB._id,
            tipo: proveedorDB.tipo,
            identificacion: proveedorDB.identificacion,
            nombre: proveedorDB.nombre,
            repreLegal: proveedorDB.repreLegal,
            telefono: proveedorDB.telefono,
            email: proveedorDB.email,
            direccion: proveedorDB.direccion,
            activo: proveedorDB.activo
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
//Eliminar proveedor
//En este caso no se eliminara el registro si no que se pondra en un estado de inactivo
proveedorRoutes.post('/delete', (req, res) => {
    //userRoutes.post('/delete', verificaToken,  (req: any, res: Response) => {
    const user = {
        _id: req.body._id || req.proveedor._id,
        activo: req.body.activo || req.proveedor.activo
    };
    // Se entrega la información para actualizar el campo activo a false
    proveedor_model_1.Proveedor.findByIdAndUpdate(req.proveedor._id, user, { new: true }, (err, proveedorDB) => {
        if (err)
            throw err;
        if (!proveedorDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un trabajador con ese ID'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: proveedorDB._id,
            documento: proveedorDB.identificacion,
            activo: false
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
//Se exporta la ruta de proveedores
exports.default = proveedorRoutes;
