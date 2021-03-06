import { Schema, Document, model } from 'mongoose';

const avanceObraSchema = new Schema({

    idObra:{
            // type: Schema.Types.ObjectId,
            // ref: 'Obra',
            // required: [ true, 'Debe de existir la Obra a la cual se le va a registrar el avance']
    
    type: String
},

    fechaAvance:{
        type: Date
    },

    descripcion:{
        type: String
    },

    foto: [{
        type: String
    }],

    // coords: {
    //     type: String //Latitud -12.88 , 14,6716 
    // },

    latitude: {
        type: String
    },

    longitude: {
        type: String
    },

    plano: [{
        type: String
    }],

    usuario: {
        //type: String
         type:Schema.Types.ObjectId,
         ref: 'Usuario',
         required: [true, 'Debe de enviar el usuario quien creo el avance.']
    },

    created: {
        type: Date
    },

    activo: {
        type: Boolean
    }


});

// avanceObraSchema.pre<IAvanceObra>('save', function( next ){
//     this.created = new Date();
//     next();
// });

interface IAvanceObra extends Document {
    idObra: String;
    fechaAvance: Date;
    descripcion: String;
    foto: String[];
    latitude: String;
    longitude: String;
    plano: String;
    usuario: String;
    created: Date;
    activo: boolean;
}

export const AvanceObra = model<IAvanceObra>('AvanceObra', avanceObraSchema);






    

