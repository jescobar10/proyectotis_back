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
const autenticacion_1 = require("../middlewares/autenticacion");
const avanceobra_model_1 = require("../models/avanceobra.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const avanceObraRoutes = express_1.Router();
//Se define el filesystem que va a permitir subor los archivos img / pdf
const fileSystem = new file_system_1.default();
//Obtener avance Obra Paginados
avanceObraRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Paginación
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const avanceObras = yield avanceobra_model_1.AvanceObra.find()
        .sort({ _id: 1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    res.json({
        ok: true,
        pagina,
        avanceObras
    });
}));
//Listar avance de obra por id
avanceObraRoutes.get('/:id', (req, res) => {
    let id = req.params.id;
    avanceobra_model_1.AvanceObra.findOne({ _id: id }, (err, avanceObraDB) => {
        if (err)
            throw err;
        if (!avanceObraDB) {
            return res.json({
                ok: false,
                mensaje: `El avance de obra con identificacion ${id} no esta activo`
            });
        }
        if (avanceObraDB.activo) {
            let avanceObra = {
                _id: avanceObraDB._id,
                idObra: avanceObraDB.idObra,
                fechaAvance: avanceObraDB.fechaAvance,
                descripcion: avanceObraDB.descripcion,
                foto: avanceObraDB.foto,
                latitude: avanceObraDB.latitude,
                longitude: avanceObraDB.longitude,
                plano: avanceObraDB.plano,
                usuario: avanceObraDB.usuario,
                created: avanceObraDB.created,
                activo: avanceObraDB.activo
            };
            res.json({
                ok: true,
                AvanceObra: avanceobra_model_1.AvanceObra
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: `La Obra con identificacion ${id} no esta activa`
            });
        }
    });
});
//Crear Avance Obra
avanceObraRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    //avanceObraRoutes.post('/', [verificaToken], (req: any, res: Response) => {
    const body = req.body;
    //body.obra = req.obra._id;
    body.usuario = req.usuario._id;
    //Para subir varios archivos 
    const imagenes = fileSystem.imagenesDeTempHaciaModulo(req.usuario._id, "avanceObra");
    //se pasa la imagen al cuerpo del avance de la obra
    body.foto = imagenes;
    avanceobra_model_1.AvanceObra.create(body).then((avanceObraDB) => __awaiter(void 0, void 0, void 0, function* () {
        //Parte que envia todo el objeto usaurio no solo el Id
        yield avanceObraDB.populate('usuario', '-password').execPopulate();
        // await avanceObraDB.populate('obra').execPopulate();
        res.json({
            ok: true,
            avanceObra: avanceObraDB
        });
    })).catch(err => {
        res.json(err);
    });
});
///Se definen las rutas o servicios para subir archivos (Imagenes / pdf)
avanceObraRoutes.post('/uploadimg', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Back Archivos Subidos : ' + req.files);
    console.log('Back Archivos Subidos : ' + req.files.image);
    console.log('Back Archivos Req : ' + req.image);
    //Se valida si viene algun archivo 
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }
    //Se sube el archivo
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            mensaje: 'No se subio ningun archivo'
        });
    }
    //si no es ni imagen 
    if (!file.mimetype.includes('image')) {
        //if( !file.mimetype.includes('image') || !file.mimetype.includes('pdf')){
        return res.status(400).json({
            mensaje: 'Lo que subio no es una imagen'
        });
    }
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
avanceObraRoutes.get('/imagen/:avanceObraid/:img', (req, res) => {
    const avanceObraid = req.params.avanceObraid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(avanceObraid, img, "avanceObra");
    res.sendFile(pathFoto);
});
// PDF
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
///Se definen las rutas o servicios para subir archivos (pdf)
avanceObraRoutes.post('/uploadpdf', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        //if( !file.mimetype.includes('image') || !file.mimetype.includes('pdf')){
        return res.status(400).json({
            mensaje: 'Lo que subio no es una imagen'
        });
    }
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
avanceObraRoutes.get('/imagen/:avanceObraid/:pdf', (req, res) => {
    const avanceObraid = req.params.avanceObraid;
    const img = req.params.pdf;
    const pathFoto = fileSystem.getFotoUrl(avanceObraid, img, "avanceObra");
    res.sendFile(pathFoto);
});
exports.default = avanceObraRoutes;
