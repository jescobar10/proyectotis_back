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
const obra_model_1 = require("../models/obra.model");
const token_1 = __importDefault(require("../classes/token"));
const file_system_1 = __importDefault(require("../classes/file-system"));
const autenticacion_1 = require("../middlewares/autenticacion");
const obraRoutes = express_1.Router();
//Se define el filesystem que va a permitir subir los archivos img / pdf
const fileSystem = new file_system_1.default();
//Listar las obras paginadas
obraRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Se solicita el numero de pagina , parametro opcional
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const body = req.body;
    const obras = yield obra_model_1.Obra.find()
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
//Listar la obra por id
obraRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    obra_model_1.Obra.findOne({ _id: id }, (err, obraDB) => {
        if (err)
            throw err;
        if (!obraDB) {
            return res.json({
                ok: false,
                mensaje: `No existe Obra con identificacion ${id}`
            });
        }
        if (obraDB.activo) {
            let obra = {
                _id: obraDB._id,
                identObra: obraDB.identObra,
                nombreObra: obraDB.nombreObra,
                descripcion: obraDB.descripcion,
                fechaInicio: obraDB.fechaInicio,
                fechaFin: obraDB.fechaFin,
                regPlano: obraDB.regPlano,
                activo: obraDB.activo
            };
            res.json({
                ok: true,
                obra
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: `La Obra con identificacion ${id} no esta activa`
            });
        }
    });
}));
//Listar las obras para drop
obraRoutes.get('/listarObras', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const obras = yield obra_model_1.Obra.find()
        //Muestra ordenado por nombre de la obra
        .sort({ nombreObra: 1 })
        .exec();
    res.json({
        obras
    });
}));
//Servicio Crear Obras
obraRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Ingreso al guardar obra');
    const body = req.body;
    body.usuario = req.usuario._id;
    // const clienteId = body.cliente;
    // const cliente = await Cliente.findOne({_id:clienteId})
    // .then(clienteDB => {
    //     console.log(clienteDB);
    //     return clienteDB;
    // }).catch(err => {
    //     console.log(err);
    //     return undefined;
    // })
    // if(!cliente){
    //     return res.json({
    //         ok:false,
    //         mensaje:`Ha existido un error con el ciente _id: ${ clienteId }`
    //     });
    // }
    //Para subir varios archivos 
    const pdfs = fileSystem.imagenesDeTempHaciaModulo(req.usuario._id, "obra");
    console.log('Nombre de Pdf cargado: ' + pdfs);
    body.regPlano = pdfs;
    console.log('objeto enviado: ' + body);
    //Se crea el obra en Base de datos
    obra_model_1.Obra.create(body).then((obraDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield obraDB.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            obra: obraDB._id
        });
    })).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
}));
///Se definen las rutas o servicios para subir archivos ( pdf)
obraRoutes.post('/uploadpdf', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Back Archivos Subidos : ' + req.files);
    console.log('Back Archivos Req : ' + req.pdf);
    //Se valida si viene algun archivo 
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }
    //Se sube el archivo
    const file = req.files.pdf;
    if (!file) {
        return res.status(400).json({
            mensaje: 'No se subio ningun archivo'
        });
    }
    //si no es ni imagen ni pdf
    if (!file.mimetype.includes('pdf')) {
        return res.status(400).json({
            mensaje: 'Lo que subio no es un pdf'
        });
    }
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
obraRoutes.get('/pdf/:obraid/:pdf', (req, res) => {
    const obraid = req.params.obraid;
    const pdf = req.params.pdf;
    const pathPDF = fileSystem.getPDFUrl(obraid, pdf, "obra");
    res.sendFile(pathPDF);
});
//Actualizar Obra
obraRoutes.post('/update', (req, res) => {
    //userRoutes.post('/update', verificaToken,  (req: any, res: Response) => {
    //Buscamos que exista la obra
    obra_model_1.Obra.findById({ _id: req.body._id }, (err, obraDB) => __awaiter(void 0, void 0, void 0, function* () {
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
            //cliente: req.body.cliente || obraDB.cliente,         
            activo: req.body.activo || obraDB.activo
        };
        // const cliente = await Cliente.findOne({_id:obra.cliente})
        // .then(clienteDB => {
        //     console.log(clienteDB);
        //     return clienteDB;
        // }).catch(err => {
        //     console.log(err);
        //     return undefined;
        // })
        // if(!cliente){
        //     return res.json({
        //         ok:false,
        //         mensaje:`Ha existido un error con el ciente _id: ${ obra.cliente }`
        //     });
        // }
        // Se entrega la información para actualizar 
        obra_model_1.Obra.findByIdAndUpdate(req.body._id, obra, { new: true }, (err, obraDB) => {
            if (err)
                throw err;
            if (!obraDB) {
                return res.json({
                    ok: false,
                    mensaje: 'No existe una obra con ese ID'
                });
            }
            const tokenObra = token_1.default.getJwtToken({
                _id: obraDB._id,
                identObra: obraDB.identObra,
                nombreObra: obraDB.nombreObra,
                descripcion: obraDB.descripcion,
                fechaInicio: obraDB.fechaInicio,
                fechaFin: obraDB.fechaFin,
                regPlano: obraDB.regPlano,
                //cliente: obraDB.cliente,
                activo: obraDB.activo
            });
            res.json({
                ok: true,
                token: tokenObra
            });
        });
    }));
});
//Se exporta la ruta de las obras
exports.default = obraRoutes;
