"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const trabajadorObraSchema = new mongoose_1.Schema({
    idTrabajador: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Trabajador',
        required: [true, "Debe existir un trabajador para crear la relacion"]
    },
    idObra: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Obra',
        required: [true, "Debe existir una obra para crear la relacion"]
    },
    fecha: {
        type: String,
        required: [true, "Debe existir la fecha en la que se creo la vinculacion"]
    }
});
exports.TrabajadorObra = mongoose_1.model('TrabajadoresObra', trabajadorObraSchema);
