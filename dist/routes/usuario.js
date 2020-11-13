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
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const userRoutes = express_1.Router();
//Listar usuarios paginados
userRoutes.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    //Se solicita el numero de pagina , parametro opcional
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const body = req.body;
    const usuarios = yield usuario_model_1.Usuario.find({ activo: true })
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
//Retornar usuario por email
userRoutes.get('/:email', (req, res) => {
    let email = req.params.email;
    usuario_model_1.Usuario.findOne({ email: email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: `No existe usuario con documento ${email}`
            });
        }
        if (userDB.activo) {
            let persona = {
                _id: userDB._id,
                documento: userDB.documento,
                nombre: userDB.nombre,
                apellido: userDB.apellido,
                genero: userDB.genero,
                telefono: userDB.telefono,
                email: userDB.email,
                rol: userDB.rol,
                password: userDB.password,
                activo: userDB.activo
            };
            res.json({
                ok: true,
                usuario: persona
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: `El usuario con documento ${email} no esta activo`
            });
        }
    });
});
//Servicio Crear Usuario  .
userRoutes.post('/create', (req, res) => {
    const user = {
        documento: req.body.documento,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        genero: req.body.genero,
        telefono: req.body.telefono,
        email: req.body.email,
        rol: req.body.rol,
        //Encriptamos el password y lo pasamos por 10 vueltas 
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        activo: req.body.activo
        //fechaNacimiento,
        //avatar
    };
    //Login 
    userRoutes.post('/login', (req, res) => {
        const body = req.body;
        //Traemos el usuario por la llave en este caso email
        usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
            if (err)
                throw err;
            if (!userDB) {
                return res.json({
                    ok: false,
                    mensaje: 'Usuario/Contraseña no son correctos'
                });
            }
            //Se utiliza el metodo comparar password
            if (userDB.compararPassword(body.password)) {
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
            }
            else {
                return res.json({
                    ok: false,
                    mensaje: 'Usuario/Contraseña no son correctos ***'
                });
            }
        });
    });
    //Se crea el usuario en Base de datos
    usuario_model_1.Usuario.create(user).then(userDB => {
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
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//Actualizar Usuario
userRoutes.post('/update', (req, res) => {
    //userRoutes.post('/update', verificaToken,  (req: any, res: Response) => {
    const user = {
        documento: req.body.documento || req.usuario.documento,
        nombre: req.body.nombre || req.usuario.nombre,
        apellido: req.body.apellido || req.usuario.apellido,
        genero: req.body.genero || req.usuario.genero,
        telefono: req.body.telefono || req.usuario.telefono,
        //email: req.body.email || req.usuario.email,
        rol: req.body.rol || req.usuario.rol,
        password: req.body.password || req.usuario.password
    };
    // Se entrega la información para actualizar 
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
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
//Eliminar Usuario
//En este caso no se eleiminara el registro si no que se pondra en un estado de inactivo
userRoutes.post('/delete', (req, res) => {
    //userRoutes.post('/delete', verificaToken,  (req: any, res: Response) => {
    const user = {
        _id: req.body.email || req.usuario.email,
        activo: req.body.activo || req.usuario.activo
    };
    // Se entrega la información para actualizar el campo activo a false
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            documento: userDB.documento,
            activo: false
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
//Se exporta 
exports.default = userRoutes;
