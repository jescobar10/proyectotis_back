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
const material_model_1 = require("../models/material.model");
const proveedor_model_1 = require("../models/proveedor.model");
const token_1 = __importDefault(require("../classes/token"));
const materialRoutes = express_1.Router();
//Listar los materiales paginadas
materialRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Se solicita el numero de pagina , parametro opcional
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const body = req.body;
    const materiales = yield material_model_1.Material.find()
        //Muestra ordenado por las referencia
        .sort({ referencia: 1 })
        .skip(skip)
        //Se pagina de 10 en 10 
        .limit(10)
        .exec();
    res.json({
        ok: true,
        pagina,
        materiales
    });
}));
//Listar los materiales paginadas
materialRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let material = yield material_model_1.Material.findOne({ codigo: id })
        .then(materialDB => {
        console.log(materialDB);
        return materialDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    });
    if (!material) {
        return res.json({
            ok: false,
            mensaje: `Ha existido un error con el material _id ${id}`
        });
    }
    let proveedor = yield proveedor_model_1.Proveedor.findOne({ _id: material.proveedor })
        .then(proveedorDB => {
        console.log(proveedorDB);
        return proveedorDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    });
    if (!proveedor) {
        return res.json({
            ok: false,
            mensaje: `Ha existido un error con el proveedor _id ${material.proveedor}`
        });
    }
    return res.json({
        ok: true,
        material,
        proveedor
    });
}));
//Servicio Crear Materiales
materialRoutes.post('/create', (req, res) => {
    const material = {
        codigo: req.body.codigo,
        referencia: req.body.referencia,
        unidadMedida: req.body.unidadMedida,
        precio: req.body.precio,
        cantidad: req.body.cantidad,
        proveedor: req.body.proveedor,
        activo: req.body.activo
    };
    //Se crea el obra en Base de datos
    material_model_1.Material.create(material).then(materialDB => {
        const tokenUser = token_1.default.getJwtToken({
            _id: materialDB._id,
            codigo: materialDB.codigo,
            referencia: materialDB.referencia,
            unidadMedida: materialDB.unidadMedida,
            precio: materialDB.precio,
            cantidad: materialDB.cantidad,
            proveedor: materialDB.proveedor,
            activo: materialDB.activo
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
//Actualizar Materiales
materialRoutes.post('/update', (req, res) => {
    //userRoutes.post('/update', verificaToken,  (req: any, res: Response) => {
    //Buscamos que exista el Material
    material_model_1.Material.findById({ _id: req.body._id }, (err, materialDB) => {
        // Si no se puede procesar el query se arroja un error
        if (err)
            throw err;
        // Si el Material no existe en la BD no se procede con la petición
        if (!materialDB) {
            return res.json({
                ok: false,
                mensaje: `No existe el material con _id ${req.body._id}`
            });
        }
        ;
        if (!req.body.activo && !materialDB.activo) {
            return res.json({
                ok: false,
                mensaje: `El material con _id ${req.body._id} no está activo`
            });
        }
        const material = {
            codigo: req.body.codigo || materialDB.codigo,
            referencia: req.body.referencia || materialDB.referencia,
            unidadMedida: req.body.unidadMedida || materialDB.unidadMedida,
            precio: req.body.precio || materialDB.precio,
            cantidad: req.body.cantidad || materialDB.cantidad,
            proveedor: req.body.proveedor || materialDB.proveedor,
            activo: req.body.activo || materialDB.activo
        };
        // Se entrega la información para actualizar 
        material_model_1.Material.findByIdAndUpdate(req.body._id, material, { new: true }, (err, materialDB) => {
            if (err)
                throw err;
            if (!materialDB) {
                return res.json({
                    ok: false,
                    mensaje: 'No existe un material con ese ID'
                });
            }
            const tokenUser = token_1.default.getJwtToken({
                _id: materialDB._id,
                codigo: materialDB.codigo,
                referencia: materialDB.referencia,
                unidadMedida: materialDB.unidadMedida,
                cantidad: materialDB.cantidad,
                proveedor: materialDB.proveedor,
                precio: materialDB.precio,
                activo: materialDB.activo
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        });
    });
});
//Eliminar materiales
//En este caso no se eliminara el registro si no que se pondra en un estado de inactivo
// materialRoutes.post('/delete', (req: any, res: Response) => {
//     //userRoutes.post('/delete', verificaToken,  (req: any, res: Response) => {
//     const obra = {
//         _id: req.body._id || req.material._id,        
//         activo: req.body.activo || req.material.activo
//     }
//     // Se entrega la información para actualizar el campo activo a false
//     Material.findByIdAndUpdate( req.material._id, obra, { new: true }, ( err, materialDB) => {
//         if( err ) throw err;
//         if( !materialDB  ) {
//             return res.json({
//                 ok: false,
//                 mensaje: 'No existe un material con ese ID'
//             });
//         }
//         const tokenUser = Token.getJwtToken({
//             _id: materialDB._id,
//                     documento: materialDB.codigo,
//                     activo: false  
//         });
//         res.json({
//             ok: true,
//             token: tokenUser
//         });
//     });   
// });
//Se exporta la ruta de los materiales
exports.default = materialRoutes;
