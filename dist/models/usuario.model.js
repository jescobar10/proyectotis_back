"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const usuarioSchema = new mongoose_1.Schema({
    documento: {
        type: String,
        //unique: true,
        required: [true, 'El Documento es necesario ']
    },
    nombre: {
        type: String,
        required: [true, 'El Nombre es necesario ']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es necesario ']
    },
    genero: {
        type: String,
        required: [true, 'El genero es necesario ']
    },
    telefono: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El Email es necesario ']
    },
    rol: {
        type: String,
        required: [true, 'El Rol es necesario ']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria ']
    },
    activo: {
        type: Boolean
    }
    // fechaNacimiento: {
    //     type: Date        
    // }
    // avatar: {
    //     type: String, 
    //     default: 'av-1.png'
    // }
});
//Metodo para comparar contraseña
usuarioSchema.method('compararPassword', function (password = '') {
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
//Se exporta el modelo de usuarios
exports.Usuario = mongoose_1.model('Usuario', usuarioSchema);
