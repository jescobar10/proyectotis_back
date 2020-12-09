"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialSalida = void 0;
const mongoose_1 = require("mongoose");
const materialSalidaSchema = new mongoose_1.Schema({
    idMaterial: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Material',
        required: [true, "Debe estar ligado el material al cual se va a registrar la salida de material"]
    },
    idObra: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Obra',
        required: [true, "Debe estar ligada a una obra la salida de material que se desea registrar"]
    },
    fecha: {
        type: Date,
        required: [true, "Se debe registrar la fecha de la salida del material"]
    },
    cantidad: {
        type: Number,
        required: [true, "Se debe registrar la cantidad de material que sale"]
    }
});
exports.MaterialSalida = mongoose_1.model('MaterialesSalida', materialSalidaSchema);
