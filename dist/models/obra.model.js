"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Obra = void 0;
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
    regPlano: [{
            type: String
        }],
    //Relacion Cliente
    //    cliente: {
    //        type: Schema.Types.ObjectId,
    //        ref: 'Cliente',
    //        required: [true, 'Se debe vincular un cliente a la obra']
    //    },
    activo: {
        type: Boolean
    },
    usuario: {
        //type: String
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de enviar el usuario quien creo el avance.']
    },
});
//Se exporta el modelo de Obra
exports.Obra = mongoose_1.model('Obra', obraSchema);
