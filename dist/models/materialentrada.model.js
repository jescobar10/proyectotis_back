"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const materialEntradaSchema = new mongoose_1.Schema({
    idMaterial: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Material',
        required: [true, "Debe estar ligado el material al cual se va a registrar la entrada"]
    },
    idProveedor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: [true, "Debe estar ligado un proveedor a la entrada que se desea registrar"]
    },
    fecha: {
        type: Date,
        required: [true, "Se debe registrar la fecha de la entrada del material"]
    },
    cantidad: {
        type: Number,
        required: [true, "Se debe registrar la cantidad de material que ingreso"]
    }
});
exports.MaterialEntrada = mongoose_1.model('MaterialesEntrada', materialEntradaSchema);
