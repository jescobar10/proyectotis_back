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
    const usuarios = yield trabajador_model_1.Trabajador.find({ activo: body.activo })
        //Muestra ordenado por nombre
        .sort({ nombre: 1 })
        .skip(skip)
        //Se pagina de 10 en 10 
        .limit(10)
        .exec();
    res.json({
        ok: true,
        pagina,
        usuarios
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
        obra: req.body.obra,
        activo: req.body.activo
    };
    //Se crea el trabajador en Base de datos
    trabajador_model_1.Trabajador.create(trabajador).then(trabajadorDB => {
        const tokenUser = token_1.default.getJwtToken({
            _id: trabajadorDB._id,
            documento: trabajadorDB.documento,
            nombre: trabajadorDB.nombre,
            apellido: trabajadorDB.apellido,
            genero: trabajadorDB.genero,
            telefono: trabajadorDB.telefono,
            email: trabajadorDB.email,
            direccion: trabajadorDB.direccion,
            cargo: trabajadorDB.cargo,
            obra: trabajadorDB.obra,
            activo: trabajadorDB.activo
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
//QUEDE AQUI
//Actualizar Trabajador
userRoutes.post('/update', (req, res) => {
    //userRoutes.post('/update', verificaToken,  (req: any, res: Response) => {
    const user = {
        documento: req.body.documento || req.usuario.documento,
        nombre: req.body.nombre || req.usuario.nombre,
        apellido: req.body.apellido || req.usuario.apellido,
        genero: req.body.genero || req.usuario.genero,
        telefono: req.body.telefono || req.usuario.telefono,
        email: req.body.email || req.usuario.email,
        rol: req.body.rol || req.usuario.rol,
        password: req.body.password || req.usuario.password
    };
    // Se entrega la información para actualizar 
    trabajador_model_1.Trabajador.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Noexiste un usuario con ese ID'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            documento: userDB.documento,
            nombre: userDB.nombre,
            apellido: userDB.apellido,
            genero: userDB.genero,
            telefono: userDB.telefono,
            email: userDB.email,
            rol: userDB.rol,
            password: userDB.password
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
