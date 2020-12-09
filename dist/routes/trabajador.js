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
const trabajador_model_1 = require("../models/trabajador.model");
const token_1 = __importDefault(require("../classes/token"));
const trabajadorRoutes = express_1.Router();
//Listar trabajadores paginados
trabajadorRoutes.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    //Se solicita el numero de pagina , parametro opcional
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const body = req.body;
    const trabajadores = yield trabajador_model_1.Trabajador.find()
        //Muestra ordenado por nombre
        .sort({ nombre: 1 })
        .skip(skip)
        //Se pagina de 10 en 10 
        .limit(10)
        .exec();
    res.json({
        ok: true,
        pagina,
        trabajadores
    });
}));
//Servicio Crear Trabajador
trabajadorRoutes.post('/create', (req, res) => {
    const trabajador = {
        documento: req.body.documento,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        genero: req.body.genero,
        telefono: req.body.telefono,
        email: req.body.email,
        direccion: req.body.direccion,
        cargo: req.body.cargo,
        //obra              : req.body.obra,
        activo: req.body.activo
    };
    //Se crea el trabajador en Base de datos
    trabajador_model_1.Trabajador.create(trabajador).then(trabajadorDB => {
        const tokenTrabajador = token_1.default.getJwtToken({
            _id: trabajadorDB._id,
            documento: trabajadorDB.documento,
            nombre: trabajadorDB.nombre,
            apellido: trabajadorDB.apellido,
            genero: trabajadorDB.genero,
            telefono: trabajadorDB.telefono,
            email: trabajadorDB.email,
            direccion: trabajadorDB.direccion,
            cargo: trabajadorDB.cargo,
            //obra: trabajadorDB.obra,
            activo: trabajadorDB.activo
        });
        res.json({
            ok: true,
            token: tokenTrabajador
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//Retornar trabajador por documento
trabajadorRoutes.get('/:documento', (req, res) => {
    let documento = req.params.documento;
    trabajador_model_1.Trabajador.findOne({ documento }, (err, trabajadorDB) => {
        if (err)
            throw err;
        if (!trabajadorDB) {
            return res.json({
                ok: false,
                mensaje: `No existe un trabajador con documento ${documento}`
            });
        }
        if (trabajadorDB.activo) {
            let trabajador = {
                _id: trabajadorDB._id,
                documento: trabajadorDB.documento,
                nombre: trabajadorDB.nombre,
                apellido: trabajadorDB.apellido,
                genero: trabajadorDB.genero,
                telefono: trabajadorDB.telefono,
                email: trabajadorDB.email,
                direccion: trabajadorDB.direccion,
                cargo: trabajadorDB.cargo,
                activo: trabajadorDB.activo
            };
            res.json({
                ok: true,
                trabajador
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: `El trabajador con documento ${documento} no esta activo`
            });
        }
    });
});
//Actualizar Trabajador
trabajadorRoutes.post('/update', (req, res) => {
    //Buscamos que exista el usuario
    trabajador_model_1.Trabajador.findById({ _id: req.body._id }, (err, trabajadorDB) => {
        // Si no se puede procesar el query se arroja un error
        if (err)
            throw err;
        // Si el trabajador no existe en la BD no se procede con la petición
        if (!trabajadorDB) {
            return res.json({
                ok: false,
                mensaje: `No existe el trabajador con _id ${req.body._id}`
            });
        }
        ;
        if (!req.body.activo && !trabajadorDB.activo) {
            return res.json({
                ok: false,
                mensaje: `El trabajador con _id ${req.body._id} no está activo`
            });
        }
        const trabajador = {
            _id: req.body._id || trabajadorDB._id,
            documento: req.body.documento || trabajadorDB.documento,
            nombre: req.body.nombre || trabajadorDB.nombre,
            apellido: req.body.apellido || trabajadorDB.apellido,
            genero: req.body.genero || trabajadorDB.genero,
            telefono: req.body.telefono || trabajadorDB.telefono,
            email: req.body.email || trabajadorDB.email,
            direccion: req.body.direccion || trabajadorDB.direccion,
            cargo: req.body.cargo || trabajadorDB.cargo,
            activo: req.body.activo || trabajadorDB.activo
        };
        console.log(trabajador);
        trabajador_model_1.Trabajador.updateOne({ _id: req.body._id }, trabajador, { new: true }, (err, trabajadorUpdated) => {
            if (err)
                throw err;
            const tokenTrabajador = token_1.default.getJwtToken({
                _id: trabajador._id,
                documento: trabajador.documento,
                nombre: trabajador.nombre,
                apellido: trabajador.apellido,
                genero: trabajador.genero,
                telefono: trabajador.telefono,
                email: trabajador.email,
                direccion: trabajador.direccion,
                cargo: trabajador.cargo,
                activo: trabajador.activo
            });
            res.json({
                ok: true,
                mensaje: `Se ha actualizado el trabajador con documento ${trabajador.documento}`,
                token: tokenTrabajador
            });
        });
    });
});
//Se exporta la ruta de trabajadores
exports.default = trabajadorRoutes;
