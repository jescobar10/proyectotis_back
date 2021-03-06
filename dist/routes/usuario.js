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
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = express_1.Router();
//Listar usuarios paginados
userRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Se solicita el numero de pagina , parametro opcional
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const body = req.body;
    const usuarios = yield usuario_model_1.Usuario.find()
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
                mensaje: `No existe usuario con email ${email}`
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
                mensaje: `El usuario con email ${email} no esta activo`
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
//Actualizar Usuario
userRoutes.post('/update', (req, res) => {
    //Buscamos que exista el usuario
    usuario_model_1.Usuario.findById({ _id: req.body._id }, (err, userDB) => {
        // Si no se puede procesar el query se arroja un error
        if (err)
            throw err;
        // Si el usuario no existe en la BD no se procede con la petición
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: `No existe el usuario con _id ${req.body._id}`
            });
        }
        ;
        if (((!req.body.activo) || req.body.activo == 'false') && !userDB.activo) {
            return res.json({
                ok: false,
                mensaje: `El usuario con _id ${req.body._id} no está activo`
            });
        }
        const user = {
            _id: req.body._id || userDB._id,
            documento: req.body.documento || userDB.documento,
            nombre: req.body.nombre || userDB.nombre,
            apellido: req.body.apellido || userDB.apellido,
            genero: req.body.genero || userDB.genero,
            telefono: req.body.telefono || userDB.telefono,
            email: req.body.email || userDB.email,
            rol: req.body.rol || userDB.rol,
            password: req.body.password || userDB.password,
            activo: req.body.activo || userDB.activo
        };
        console.log(user);
        usuario_model_1.Usuario.updateOne({ _id: req.body._id }, user, { new: true }, (err, userUpdated) => {
            if (err)
                throw err;
            const tokenUser = token_1.default.getJwtToken({
                _id: user._id,
                documento: user.documento,
                nombre: user.nombre,
                apellido: user.apellido,
                genero: user.genero,
                telefono: user.telefono,
                email: user.email,
                rol: user.rol,
                password: user.password
            });
            res.json({
                ok: true,
                mensaje: `Se ha actualizado el usuario con documento ${user.documento}`,
                token: tokenUser
            });
        });
    });
});
userRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
// Eliminar Usuario
// En este caso no se eleiminara el registro si no que se pondra en un estado de inactivo
// userRoutes.post('/delete', (req: any, res: Response) => {
//     //userRoutes.post('/delete', verificaToken,  (req: any, res: Response) => {
//     const user = {  
//         _id: req.body._id || req.usuario._id,
//         documento: req.body.documento || req.usuario.documento,
//         nombre: req.body.nombre || req.usuario.nombre,
//         apellido: req.body.apellido || req.usuario.apellido,
//         genero: req.body.genero || req.usuario.genero,
//         telefono: req.body.telefono || req.usuario.telefono,
//         //email: req.body.email || req.usuario.email,
//         rol: req.body.rol || req.usuario.rol,      
//         password: req.body.password || req.usuario.password,             
//         activo: false 
//     }
//     //let id = req.body._id;
//     Usuario.findById({_id : req.body._id}, (err,userDB) => {
//         if(err)
//             throw err;
//         if(!userDB){
//             return res.json({
//                 ok: false,
//                 mensaje: `No existe usuario con documento ${req.body.documento}`
//             });
//         }
//         if(!userDB.activo) {
//             return res.json({
//                 ok: false,
//                 mensaje: `El usuario con documento ${req.body.documento} no esta activo`
//             });
//         }      
//     });
//     // Se entrega la información para actualizar el campo activo a false
//     Usuario.findByIdAndUpdate( req.body._id, user, { new: true }, ( err, userDB) => {
//         if( err ) throw err;
//         if( !userDB  ) {
//             return res.json({
//                 ok: false,
//                 mensaje: `No existe un usuario con documento ${user.documento} y nombre ${user.nombre}`
//             });
//         }      
//         res.json({
//             ok: true,
//             mensaje: `Se ha inactivado el usuario con documento ${user.documento} y nombre ${user.nombre}`
//         });
//     });   
// });
//Se exporta 
exports.default = userRoutes;
