"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const materialSchema = new mongoose_1.Schema({
    codigo: {
        type: String,
        unique: true,
        required: [true, 'El codigo del material es necesario ']
    },
    referencia: {
        type: String,
        required: [true, 'La referencia o descripción del material es necesario ']
    },
    unidadMedida: {
        type: String
    },
    precio: {
        type: Number,
        required: [true, 'El precio o valor del material es necesario.']
    },
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es necesaria.']
    },
    proveedor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Proveedor",
        required: [true, 'Debe de existir una referencia a un proveedor']
    },
    activo: {
        type: Boolean
    }
});
//Se exporta el modelo de Material
exports.Material = mongoose_1.model('Materiales', materialSchema);
