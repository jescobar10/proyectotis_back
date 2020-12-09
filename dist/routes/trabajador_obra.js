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
const trabajador_obra_model_1 = require("../models/trabajador_obra.model");
const token_1 = __importDefault(require("../classes/token"));
const trabajador_model_1 = require("../models/trabajador.model");
const obra_model_1 = require("../models/obra.model");
const express_1 = require("express");
const trabajadorObraRoutes = express_1.Router();
trabajadorObraRoutes.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const body = req.body;
    const trabajadoresobras = yield trabajador_obra_model_1.TrabajadorObra.find()
        .sort({ fecha: 1 })
        .skip(skip)
        .limit(10)
        .exec();
    return res.json({
        ok: true,
        pagina,
        trabajadoresobras
    });
}));
trabajadorObraRoutes.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let id = req.params.id;
    yield trabajador_obra_model_1.TrabajadorObra.findOne({ id }, (err, TrabajadorObraDB) => {
        if (err)
            throw err;
        if (!TrabajadorObraDB) {
            return res.json({
                ok: false,
                mensaje: `No existe una vinculacion entre trabajador y obra con id ${id}`
            });
        }
        let trabajadorObra = {
            idTrabajador: TrabajadorObraDB.idTrabajador,
            idObra: TrabajadorObraDB.idObra,
            fecha: TrabajadorObraDB.fecha
        };
        return res.json({
            ok: true,
            trabajadorObra
        });
    });
}));
trabajadorObraRoutes.post('/create', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const vinculacion = {
        idTrabajador: req.body.idTrabajador,
        idObra: req.body.idObra,
        fecha: req.body.fecha
    };
    let trabajador = yield trabajador_model_1.Trabajador.findOne({ _id: vinculacion.idTrabajador })
        .then(trabajadorDB => {
        console.log(trabajadorDB);
        return trabajadorDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    });
    if (!trabajador) {
        return res.json({
            ok: false,
            mensaje: `Ha existido un problema con el trabajador con _id ${vinculacion.idTrabajador}`
        });
    }
    console.log(trabajador);
    let obra = yield obra_model_1.Obra.findOne({ _id: vinculacion.idObra })
        .then(obraDB => {
        console.log(obraDB);
        return obraDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    });
    if (!obra) {
        return res.json({
            ok: false,
            mensaje: `Ha existido un problema con la obra con _id ${vinculacion.idObra}`
        });
    }
    console.log(obra);
    trabajador_obra_model_1.TrabajadorObra.create(vinculacion)
        .then(vinculacionDB => {
        const tokenVinculacion = token_1.default.getJwtToken({
            _id: vinculacionDB._id,
            idTrabajador: vinculacionDB.idTrabajador,
            idObra: vinculacionDB.idObra,
            fecha: vinculacionDB.fecha
        });
        return res.json({
            ok: true,
            token: tokenVinculacion,
            mensaje: `Se ha creado la vinculacion con exito, _id = ${vinculacionDB._id}`
        });
    }).catch(err => {
        return res.json({
            ok: false,
            err
        });
    });
}));
trabajadorObraRoutes.post('/update', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let vinculacionDB = yield trabajador_obra_model_1.TrabajadorObra.findOne({ _id: req.body._id })
        .then(trabajadorObraDB => {
        console.log(trabajadorObraDB);
        return trabajadorObraDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    });
    if (!vinculacionDB) {
        return res.json({
            ok: false,
            mensaje: `Ha existido un error con la vinculacion con _id ${req.body._id}`
        });
    }
    let vinculacion = {
        _id: req.body._id || vinculacionDB._id,
        idTrabajador: req.body.idTrabajador || vinculacionDB.idTrabajador,
        idObra: req.body.idObra || vinculacionDB.idObra,
        fecha: req.body.fecha || vinculacionDB.fecha
    };
    let trabajador = yield trabajador_model_1.Trabajador.findOne({ _id: vinculacion.idTrabajador })
        .then(trabajadorDB => {
        console.log(trabajadorDB);
        return trabajadorDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    });
    if (!trabajador) {
        return res.json({
            ok: false,
            mensaje: `Ha existido un problema con el trabajador con _id ${vinculacion.idTrabajador}`
        });
    }
    console.log(trabajador);
    let obra = yield obra_model_1.Obra.findOne({ _id: vinculacion.idObra })
        .then(obraDB => {
        console.log(obraDB);
        return obraDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    });
    if (!obra) {
        return res.json({
            ok: false,
            mensaje: `Ha existido un problema con la obra con _id ${vinculacion.idObra}`
        });
    }
    console.log(obra);
    trabajador_obra_model_1.TrabajadorObra.updateOne({ _id: vinculacion._id }, vinculacion, { new: true })
        .then(trabajadorObraDB => {
        const tokenVinculacion = token_1.default.getJwtToken({
            _id: vinculacion._id,
            idTrabajador: vinculacion.idTrabajador,
            idObra: vinculacion.idObra,
            fecha: vinculacion.fecha
        });
        return res.json({
            ok: true,
            token: tokenVinculacion,
            mensaje: `Se ha actualizado la vinculacion con exito, _id = ${vinculacion._id}`
        });
    }).catch(err => {
        return res.json({
            ok: false,
            err
        });
    });
}));
exports.default = trabajadorObraRoutes;
