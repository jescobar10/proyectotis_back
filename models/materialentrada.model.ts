import { Schema, Document, model } from 'mongoose';
import { Material } from './material.model';

const materialEntradaSchema = new Schema({
    
    idMaterial:{
        type: Schema.Types.ObjectId,
        ref: 'Material',
        required: [true, "Debe estar ligado el material al cual se va a registrar la entrada"]
    },

    fecha:{
        type: Date,
        required: [true, "Se debe registrar la fecha de la entrada del material"]
    },

    cantidad:{
        type: Number,
        required: [true, "Se debe registrar la cantidad de material que ingreso"]
    }
});

interface IMaterialEntrada extends Document{
    idMaterial: String;
    fecha: Date;
    cantidad: Number
}

export const MaterialEntrada = model<IMaterialEntrada>('MaterialesEntrada',materialEntradaSchema);