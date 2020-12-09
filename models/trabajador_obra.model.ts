import { Schema, model, Document } from 'mongoose';
import { Trabajador } from './trabajador.model';
import { Obra } from './obra.model';

const trabajadorObraSchema = new Schema( {
    idTrabajador: {
        type: Schema.Types.ObjectId,
        ref: 'Trabajador',
        required: [true, "Debe existir un trabajador para crear la relacion"]
    },

    idObra: {
        type: Schema.Types.ObjectId,
        ref: 'Obra',
        required: [true, "Debe existir una obra para crear la relacion"]
    },

    fecha: {
        type: String,
        required: [true, "Debe existir la fecha en la que se creo la vinculacion"]
    }
});

interface ITrabajadorObra extends Document {
    idTrabajador: String;
    idObra: String;
    fecha: String
}

export const TrabajadorObra = model<ITrabajadorObra>('TrabajadoresObra',trabajadorObraSchema);
