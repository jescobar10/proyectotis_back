import { Schema, Document, model } from 'mongoose';
import { Material } from './material.model';
import { Obra } from './obra.model';

const materialSalidaSchema = new Schema({
    
    idMaterial:{
        type: Schema.Types.ObjectId,
        ref: 'Material',
        required: [true, "Debe estar ligado el material al cual se va a registrar la salida de material"]
    },

    idObra:{
        type: Schema.Types.ObjectId,
        ref: 'Obra',
        required: [true, "Debe estar ligada a una obra la salida de material que se desea registrar"]
    },

    fecha:{
        type: String,
        required: [true, "Se debe registrar la fecha de la salida del material"]
    },

    cantidad:{
        type: Number,
        required: [true, "Se debe registrar la cantidad de material que sale"]
    }
});

interface IMaterialSalida extends Document{
    idMaterial: String;
    idObra: String;
    fecha: String;
    cantidad: Number;
}

export const MaterialSalida = model<IMaterialSalida>('MaterialesSalida',materialSalidaSchema);