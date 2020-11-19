"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const avanceObraSchema = new mongoose_1.Schema({
    idObra: {
        //         type: Schema.Types.ObjectId,
        //         ref: 'Obra',
        //         required: [ true, 'Debe de existir la Obra a la cual se le va a registrar el avance']
        // 
        type: String
    },
    fechaAvance: {
        type: Date
    },
    descripcion: {
        type: String
    },
    foto: [{
            type: String
        }],
    coords: {
        type: String //Latitud -12.88 , 14,6716 
    },
    plano: {
        type: String
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de enviar el usuario quien creo el avance.']
    },
    created: {
        type: Date
    }
});
avanceObraSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.AvanceObra = mongoose_1.model('Post', avanceObraSchema);
