"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const obraSchema = new mongoose_1.Schema({
    identObra: {
        type: String,
        unique: true,
        required: [true, 'El codigo de la obra es necesario ']
    },
    nombreObra: {
        type: String,
        required: [true, 'El nombre de la obra es necesario.']
    },
    descripcion: {
        type: String
    },
    fechaInicio: {
        type: Date,
        required: [true, 'La fecha de inicio de la obra es necesaria.']
    },
    fechaFin: {
        type: Date,
        required: [true, 'La fecha de Finalización de la obra es necesaria.']
    },
    //PDF
    regPlano: {
        type: String
    },
    activo: {
        type: Boolean
    }
});
//Se exporta el modelo de Obra
exports.Obra = mongoose_1.model('Obras', obraSchema);
