"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const trabajadorSchema = new mongoose_1.Schema({
    documento: {
        type: String,
        unique: true,
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
        type: Number
    },
    email: {
        type: String,
        required: [true, 'El Email es necesario ']
    },
    direccion: {
        type: String
        //required: [ true, 'El genero es necesario ']
    },
    cargo: {
        type: String,
        required: [true, 'El Cargo es necesario ']
    },
    //Creo que esto va en un modulo donde se asignan obras a los trabajadores 
    // obra: {
    //     type: String 
    // },
    activo: {
        type: Boolean
    }
});
//Se exporta el modelo de Trabajador
exports.Trabajador = mongoose_1.model('Trabajador', trabajadorSchema);
