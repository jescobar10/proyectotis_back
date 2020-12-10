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
const materialentrada_model_1 = require("../models/materialentrada.model");
const token_1 = __importDefault(require("../classes/token"));
const material_model_1 = require("../models/material.model");
const proveedor_model_1 = require("../models/proveedor.model");
const materialEntradaRoutes = express_1.Router();
materialEntradaRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const body = req.body;
    const entradas = yield materialentrada_model_1.MaterialEntrada.find()
        .sort({ fecha: 1 })
        .skip(skip)
        .limit(10)
        .exec();
    res.json({
        ok: true,
        pagina,
        entradas
    });
}));
materialEntradaRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    yield materialentrada_model_1.MaterialEntrada.findOne({ id }, (err, entradaDB) => {
        if (err)
            throw err;
        if (!entradaDB) {
            return res.json({
                ok: false,
                mensaje: `No existe una entrada registrada con el id ${id}`
            });
        }
        let entrada = {
            idMaterial: entradaDB.idMaterial,
            idProveedor: entradaDB.idProveedor,
            fecha: entradaDB.fecha,
            cantidad: entradaDB.cantidad
        };
        return res.json({
            ok: true,
            entrada
        });
    });
}));
materialEntradaRoutes.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entrada = {
        idMaterial: req.body.idMaterial,
        idProveedor: req.body.idProveedor,
        fecha: req.body.fecha,
        cantidad: req.body.cantidad
    };
    let proveedor = yield proveedor_model_1.Proveedor.findOne({ _id: entrada.idProveedor })
        .then(proveedorDB => {
        console.log(proveedorDB);
        return proveedorDB;
    })
        .catch(err => {
        console.log(err);
        return undefined;
    });
    if (!proveedor) {
        return res.json({
            ok: false,
            mensaje: `Se ha encontrado un error con el proveedor con id ${entrada.idProveedor}`
        });
    }
    console.log(proveedor);
    let material = yield material_model_1.Material.findOne({ _id: entrada.idMaterial })
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
            mensaje: `Se ha encontrado un error con el material con id ${entrada.idMaterial}`
        });
    }
    console.log(material);
    let nueva_cantidad = Number(material.cantidad) + Number(entrada.cantidad);
    material.cantidad = nueva_cantidad;
    material_model_1.Material.updateOne({ _id: material._id }, material, { new: true }, (err, materialUpdated) => {
        if (err)
            throw err;
    });
    materialentrada_model_1.MaterialEntrada.create(entrada).then(entradaDB => {
        const tokenEntrada = token_1.default.getJwtToken({
            _id: entradaDB._id,
            idMaterial: entradaDB.idMaterial,
            idProveedor: entradaDB.idProveedor,
            fecha: entradaDB.fecha,
            cantidad: entradaDB.cantidad
        });
        return res.json({
            ok: true,
            token: tokenEntrada,
            mensaje: 'Se ha creado la entrada al material con exito'
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
}));
materialEntradaRoutes.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let entradaBD = yield materialentrada_model_1.MaterialEntrada.findOne({ _id: req.body._id })
        .then(entryDB => {
        console.log(entryDB);
        return entryDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    });
    if (!entradaBD) {
        return res.json({
            ok: false,
            mensaje: `No se encuentra una entrada con _id ${req.body._id}`
        });
    }
    let entrada = {
        _id: req.body._id || entradaBD._id,
        idMaterial: req.body.idMaterial || entradaBD.idMaterial,
        idProveedor: req.body.idProveedor || entradaBD.idProveedor,
        fecha: req.body.fecha || entradaBD.fecha,
        cantidad: req.body.cantidad || entradaBD.cantidad
    };
    let proveedor = yield proveedor_model_1.Proveedor.findOne({ _id: entrada.idProveedor })
        .then(proveedorDB => {
        console.log(proveedorDB);
        return proveedorDB;
    })
        .catch(err => {
        console.log(err);
        return undefined;
    });
    if (!proveedor) {
        return res.json({
            ok: false,
            mensaje: `Se ha encontrado un error con el proveedor con id ${entrada.idProveedor}`
        });
    }
    console.log(proveedor);
    let material = yield material_model_1.Material.findOne({ _id: entrada.idMaterial })
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
            mensaje: `Se ha encontrado un error con el material con id ${entrada.idMaterial}`
        });
    }
    console.log(material);
    if (entrada.cantidad < 0) {
        return res.json({
            ok: false,
            mensaje: `La cantidad no debe ser negativa`
        });
    }
    if (entrada.cantidad != undefined && Number(entrada.cantidad) != Number(entradaBD.cantidad)) {
        let nueva_cantidad = Number(material.cantidad) + (Number(entrada.cantidad) - Number(entradaBD.cantidad));
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
    materialentrada_model_1.MaterialEntrada.updateOne({ _id: entrada._id }, entrada, { new: true }, (err, entradaUpdated) => {
        if (err)
            throw err;
        const tokenEntrada = token_1.default.getJwtToken({
            _id: entrada._id,
            idMaterial: entrada.idMaterial,
            idProveedor: entrada.idProveedor,
            fecha: entrada.fecha,
            cantidad: entrada.cantidad
        });
        res.json({
            ok: true,
            mensaje: `Se ha actualizado la entrada con id ${entrada._id}`,
            token: tokenEntrada
        });
    });
}));
exports.default = materialEntradaRoutes;
