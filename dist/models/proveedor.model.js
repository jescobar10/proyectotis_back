"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proveedor = void 0;
const mongoose_1 = require("mongoose");
const proveedorSchema = new mongoose_1.Schema({
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
    activo: {
        type: Boolean
    }
});
//Se exporta el modelo de Proveedor
exports.Proveedor = mongoose_1.model('Proveedor', proveedorSchema);
