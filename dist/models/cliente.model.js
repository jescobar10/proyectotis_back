"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const clienteSchema = new mongoose_1.Schema({
    //Natural / Juridica
    tipo: {
        type: String,
        required: [true, 'El Tipo de cliente es necesario ']
    },
    identificacion: {
        type: String,
        unique: true,
        required: [true, 'La identificacion es necesaria ']
    },
    nombre: {
        type: String,
        required: [true, 'El Nombre es necesario ']
    },
    repreLegal: {
        type: String
    },
    telefono: {
        type: Number,
        required: [true, 'El Telefono es necesario ']
    },
    email: {
        type: String,
        required: [true, 'El Email es necesario ']
    },
    direccion: {
        type: String
        //required: [ true, 'El genero es necesario ']
    },
    //Creo que esto va en un modulo donde se asignan obras a los clientes
    // obra: {
    //     type: String 
    // },
    activo: {
        type: Boolean
    }
});
//Se exporta el modelo de Clientes
exports.Cliente = mongoose_1.model('Cliente', clienteSchema);
