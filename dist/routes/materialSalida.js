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
const materialsalida_model_1 = require("../models/materialsalida.model");
const token_1 = __importDefault(require("../classes/token"));
const material_model_1 = require("../models/material.model");
const obra_model_1 = require("../models/obra.model");
const materialSalidaRoutes = express_1.Router();
materialSalidaRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const body = req.body;
    const entradas = yield materialsalida_model_1.MaterialSalida.find()
        .sort({ Fecha: 1 })
        .skip(skip)
        .limit(10)
        .exec();
    res.json({
        ok: true,
        pagina,
        entradas
    });
}));
materialSalidaRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    yield materialsalida_model_1.MaterialSalida.findOne({ id }, (err, salidaDB) => {
        if (err)
            throw err;
        if (!salidaDB) {
            return res.json({
                ok: false,
                mensaje: `No existe una salida registrada con el _id ${id}`
            });
        }
        let salida = {
            idMaterial: salidaDB.idMaterial,
            idObra: salidaDB.idObra,
            fecha: salidaDB.fecha,
            cantidad: salidaDB.cantidad
        };
        return res.json({
            ok: true,
            salida
        });
    });
}));
materialSalidaRoutes.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const salida = {
        idMaterial: req.body.idMaterial,
        idObra: req.body.idObra,
        fecha: req.body.fecha,
        cantidad: req.body.cantidad
    };
    let obra = yield obra_model_1.Obra.findOne({ _id: salida.idObra })
        .then(obraBD => {
        console.log(obraBD);
        return obraBD;
    })
        .catch(err => {
        console.log(err);
        return undefined;
    });
    if (!obra) {
        return res.json({
            ok: false,
            mensaje: `Se ha encontrado un error con la obra con id ${salida.idObra}`
        });
    }
    console.log(obra);
    let material = yield material_model_1.Material.findOne({ _id: salida.idMaterial })
        .then(materialDB => {
        console.log(materialDB);
        return materialDB;
    })
        .catch(err => {
        console.log(err);
        return undefined;
    });
    if (!material) {
        return res.json({
            ok: false,
            mensaje: `Se ha encontrado un error con el material con id ${salida.idMaterial}`
        });
    }
    console.log(material);
    let nueva_cantidad = Number(material.cantidad) - Number(salida.cantidad);
    if (nueva_cantidad < 0) {
        return res.json({
            ok: false,
            mensaje: `No hay suficiente material para retirar, si se retira esa cantidad la nueva cantidad seria ${nueva_cantidad}`
        });
    }
    material.cantidad = nueva_cantidad;
    material_model_1.Material.updateOne({ _id: material._id }, material, { new: true }, (err, materialUpdated) => {
        if (err)
            throw err;
    });
    materialsalida_model_1.MaterialSalida.create(salida).then(salidaDB => {
        const tokenEntrada = token_1.default.getJwtToken({
            _id: salidaDB._id,
            idMaterial: salidaDB.idMaterial,
            idObra: salidaDB.idObra,
            fecha: salidaDB.fecha,
            cantidad: salidaDB.cantidad
        });
        return res.json({
            ok: true,
            token: tokenEntrada,
            mensaje: 'Se ha creado la salida del material con exito'
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
}));
materialSalidaRoutes.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let salidaBD = yield materialsalida_model_1.MaterialSalida.findOne({ _id: req.body._id })
        .then(departureDB => {
        console.log(departureDB);
        return departureDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    });
    if (!salidaBD) {
        return res.json({
            ok: false,
            mensaje: `No se encuentra una salida con _id ${req.body._id}`
        });
    }
    let salida = {
        _id: req.body._id || salidaBD._id,
        idMaterial: req.body.idMaterial || salidaBD.idMaterial,
        idObra: req.body.idProveedor || salidaBD.idObra,
        fecha: req.body.fecha || salidaBD.fecha,
        cantidad: req.body.cantidad || salidaBD.cantidad
    };
    let obra = yield obra_model_1.Obra.findOne({ _id: salida.idObra })
        .then(obraBD => {
        console.log(obraBD);
        return obraBD;
    })
        .catch(err => {
        console.log(err);
        return undefined;
    });
    if (!obra) {
        return res.json({
            ok: false,
            mensaje: `Se ha encontrado un error con la obra con id ${salida.idObra}`
        });
    }
    console.log(obra);
    let material = yield material_model_1.Material.findOne({ _id: salida.idMaterial })
        .then(materialDB => {
        console.log(materialDB);
        return materialDB;
    })
        .catch(err => {
        console.log(err);
        return undefined;
    });
    if (!material) {
        return res.json({
            ok: false,
            mensaje: `Se ha encontrado un error con el material con id ${salida.idMaterial}`
        });
    }
    console.log(material);
    if (salida.cantidad < 0) {
        return res.json({
            ok: false,
            mensaje: `La cantidad no debe ser negativa`
        });
    }
    if (salida.cantidad != undefined && Number(salida.cantidad) != Number(salida.cantidad)) {
        let nueva_cantidad = Number(material.cantidad) - (Number(salida.cantidad) - Number(salidaBD.cantidad));
        if (nueva_cantidad < 0) {
            return res.json({
                ok: false,
                mensaje: `No se puede actualizar la cantidad porque la nueva cantidad seria ${nueva_cantidad}`
            });
        }
        material.cantidad = nueva_cantidad;
        material_model_1.Material.updateOne({ _id: material._id }, material, { new: true }, (err, materialUpdated) => {
            if (err)
                throw err;
        });
    }
    materialsalida_model_1.MaterialSalida.updateOne({ _id: salida._id }, salida, { new: true }, (err, salidadUpdated) => {
        if (err)
            throw err;
        const tokenSalida = token_1.default.getJwtToken({
            _id: salida._id,
            idMaterial: salida.idMaterial,
            idObra: salida.idObra,
            fecha: salida.fecha,
            cantidad: salida.cantidad
        });
        res.json({
            ok: true,
            mensaje: `Se ha actualizado la salida con id ${salida._id}`,
            token: tokenSalida
        });
    });
}));
exports.default = materialSalidaRoutes;
