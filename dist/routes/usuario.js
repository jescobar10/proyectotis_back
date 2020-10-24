"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = express_1.Router();
//Servicio Crear Usuario 
userRoutes.post('/create', (req, res) => {
    const user = {
        documento: req.body.documento,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        genero: req.body.genero,
        telefono: req.body.telefono,
        email: req.body.email,
        rol: req.body.rol,
        usuarioPlataforma: req.body.usuarioPlataforma,
        //Encriptamos el password y lo pasamos por 10 vueltas 
        password: bcrypt_1.default.hashSync(req.body.password, 10),
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
                    usuarioPlataforma: userDB.usuarioPlataforma,
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
            usuarioPlataforma: userDB.usuarioPlataforma,
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
userRoutes.post('/update', autenticacion_1.verificaToken, (req, res) => {
    const user = {
        documento: req.body.documento || req.usuario.documento,
        nombre: req.body.nombre || req.usuario.nombre,
        apellido: req.body.apellido || req.usuario.apellido,
        genero: req.body.genero || req.usuario.genero,
        telefono: req.body.telefono || req.usuario.telefono,
        email: req.body.email || req.usuario.email,
        rol: req.body.rol || req.usuario.rol,
        usuarioPlataforma: req.body.usuarioPlataforma || req.usuario.usuarioPlataforma,
        password: req.body.password || req.usuario.password
    };
    // Se entrega la información para actualizar 
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
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
            usuarioPlataforma: userDB.usuarioPlataforma,
            password: userDB.password
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
//Se exporta 
exports.default = userRoutes;
