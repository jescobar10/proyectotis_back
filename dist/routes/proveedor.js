"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
proveedorRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Se solicita el numero de pagina , parametro opcional
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const body = req.body;
    const proveedores = yield proveedor_model_1.Proveedor.find()
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
//Retornar proveedor por id
proveedorRoutes.get('/:id', (req, res) => {
    let id = req.params.id;
    proveedor_model_1.Proveedor.findOne({ identificacion: id }, (err, proveedorDB) => {
        if (err)
            throw err;
        if (!proveedorDB) {
            return res.json({
                ok: false,
                mensaje: `No existe proveedor con identificacion ${id}`
            });
        }
        if (proveedorDB.activo) {
            let proveedor = {
                _id: proveedorDB._id,
                tipo: proveedorDB.tipo,
                identificacion: proveedorDB.identificacion,
                nombre: proveedorDB.nombre,
                repreLegal: proveedorDB.repreLegal,
                telefono: proveedorDB.telefono,
                email: proveedorDB.email,
                direccion: proveedorDB.direccion,
                activo: proveedorDB.activo
            };
            res.json({
                ok: true,
                proveedor
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: `El proveedor con identificacion ${id} no esta activo`
            });
        }
    });
});
//Servicio Crear Proveedor
proveedorRoutes.post('/create', (req, res) => {
    const proveedor = {
        tipo: req.body.tipo,
        identificacion: req.body.identificacion,
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
    //Buscamos que exista el proveedor
    proveedor_model_1.Proveedor.findById({ _id: req.body._id }, (err, proveedorDB) => {
        // Si no se puede procesar el query se arroja un error
        if (err)
            throw err;
        // Si el usuario no existe en la BD no se procede con la petición
        if (!proveedorDB) {
            return res.json({
                ok: false,
                mensaje: `No existe el proveedor con _id ${req.body._id}`
            });
        }
        ;
        if (((!req.body.activo) || req.body.activo == 'false') && (!proveedorDB.activo)) {
            return res.json({
                ok: false,
                mensaje: `El proveedor con _id ${req.body._id} no está activo`
            });
        }
        const proveedor = {
            tipo: req.body.tipo || proveedorDB.tipo,
            identificacion: req.body.identificacion || proveedorDB.identificacion,
            nombre: req.body.nombre || proveedorDB.nombre,
            repreLegal: req.body.repreLegal || proveedorDB.repreLegal,
            telefono: req.body.telefono || proveedorDB.telefono,
            email: req.body.email || proveedorDB.email,
            direccion: req.body.direccion || proveedorDB.direccion,
            activo: req.body.activo || proveedorDB.activo
        };
        console.log(proveedor);
        proveedor_model_1.Proveedor.updateOne({ _id: req.body._id }, proveedor, { new: true }, (err, proveedorUpdated) => {
            if (err)
                throw err;
            const tokenProveedor = token_1.default.getJwtToken({
                tipo: proveedor.tipo,
                identificacion: proveedor.identificacion,
                nombre: proveedor.nombre,
                repreLegal: proveedor.repreLegal,
                telefono: proveedor.telefono,
                email: proveedor.email,
                direccion: proveedor.direccion,
                activo: proveedor.activo
            });
            res.json({
                ok: true,
                mensaje: `Se ha actualizado el proveedor con documento ${proveedor.identificacion}`,
                token: tokenProveedor
            });
        });
    });
});
//Se exporta la ruta de proveedores
exports.default = proveedorRoutes;
