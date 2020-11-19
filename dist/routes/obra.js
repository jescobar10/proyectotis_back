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
const obra_model_1 = require("../models/obra.model");
const token_1 = __importDefault(require("../classes/token"));
const obraRoutes = express_1.Router();
//Listar las obras paginadas
obraRoutes.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    //Se solicita el numero de pagina , parametro opcional
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const body = req.body;
    const obras = yield obra_model_1.Obra.find({ activo: body.activo })
        //Muestra ordenado por nombre de la obra
        .sort({ nombreObra: 1 })
        .skip(skip)
        //Se pagina de 10 en 10 
        .limit(10)
        .exec();
    res.json({
        ok: true,
        pagina,
        obras
    });
}));
//Servicio Crear Obras
obraRoutes.post('/create', (req, res) => {
    const obra = {
        identObra: req.body.identObra,
        nombreObra: req.body.nombreObra,
        descripcion: req.body.descripcion,
        fechaInicio: req.body.fechaInicio,
        fechaFin: req.body.fechaFin,
        regPlano: req.body.regPlano,
        activo: req.body.activo
    };
    //Se crea el obra en Base de datos
    obra_model_1.Obra.create(obra).then(obraDB => {
        const tokenUser = token_1.default.getJwtToken({
            _id: obraDB._id,
            identObra: obraDB.identObra,
            nombreObra: obraDB.nombreObra,
            descripcion: obraDB.descripcion,
            fechaInicio: obraDB.fechaInicio,
            fechaFin: obraDB.fechaFin,
            regPlano: obraDB.regPlano,
            activo: obraDB.activo
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
//Actualizar Obra
obraRoutes.post('/update', (req, res) => {
    //userRoutes.post('/update', verificaToken,  (req: any, res: Response) => {
    //Buscamos que exista la obra
    obra_model_1.Obra.findById({ _id: req.body._id }, (err, obraDB) => {
        // Si no se puede procesar el query se arroja un error
        if (err)
            throw err;
        // Si la Obra no existe en la BD no se procede con la petición
        if (!obraDB) {
            return res.json({
                ok: false,
                mensaje: `No existe la obra con _id ${req.body._id}`
            });
        }
        ;
        if (!req.body.activo && !obraDB.activo) {
            return res.json({
                ok: false,
                mensaje: `La obra con _id ${req.body._id} no está activa`
            });
        }
        const obra = {
            identObra: req.body.identObra || obraDB.identObra,
            nombreObra: req.body.nombreObra || obraDB.nombreObra,
            descripcion: req.body.descripcion || obraDB.descripcion,
            fechaInicio: req.body.fechaInicio || obraDB.fechaInicio,
            fechaFin: req.body.fechaFin || obraDB.fechaFin,
            regPlano: req.body.regPlano || obraDB.regPlano,
            activo: req.body.activo || obraDB.activo
        };
        // Se entrega la información para actualizar 
        obra_model_1.Obra.findByIdAndUpdate(req.obra._id, obra, { new: true }, (err, obraDB) => {
            if (err)
                throw err;
            if (!obraDB) {
                return res.json({
                    ok: false,
                    mensaje: 'No existe una obra con ese ID'
                });
            }
            const tokenUser = token_1.default.getJwtToken({
                _id: obraDB._id,
                identObra: obraDB.identObra,
                nombreObra: obraDB.nombreObra,
                descripcion: obraDB.descripcion,
                fechaInicio: obraDB.fechaInicio,
                fechaFin: obraDB.fechaFin,
                regPlano: obraDB.regPlano,
                activo: obraDB.activo
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        });
    });
});
//Eliminar Obra
//En este caso no se eliminara el registro si no que se pondra en un estado de inactivo
obraRoutes.post('/delete', (req, res) => {
    //userRoutes.post('/delete', verificaToken,  (req: any, res: Response) => {
    const obra = {
        _id: req.body._id || req.obra._id,
        activo: req.body.activo || req.obra.activo
    };
    // Se entrega la información para actualizar el campo activo a false
    obra_model_1.Obra.findByIdAndUpdate(req.trabajador._id, obra, { new: true }, (err, obraDB) => {
        if (err)
            throw err;
        if (!obraDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe una obra con ese ID'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: obraDB._id,
            documento: obraDB.identObra,
            activo: false
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
//Se exporta la ruta de las obras
exports.default = obraRoutes;
