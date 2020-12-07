import {  Schema, model, Document }  from 'mongoose';
import { Cliente } from './cliente.model';


const obraSchema = new Schema( {
    
    identObra: {
         type: String,
         unique: true,
         required: [ true, 'El codigo de la obra es necesario ']
    },

    nombreObra: {
        type: String,       
        required: [ true, 'El nombre de la obra es necesario.']
   },

   descripcion: {
       type: String       
   },

   fechaInicio: {
       type: Date,
       required: [ true, 'La fecha de inicio de la obra es necesaria.']
   },

   fechaFin: {
       type: Date,
       required: [ true, 'La fecha de Finalización de la obra es necesaria.']
   },
   
   //PDF
   regPlano: [{
        type: String
   }],

   //Relacion Cliente
   cliente: {
       type: Schema.Types.ObjectId,
       ref: 'Cliente',
       required: [true, 'Se debe vincular un cliente a la obra']
   },

   activo: {
    type: Boolean
},

usuario: {
    //type: String
     type:Schema.Types.ObjectId,
     ref: 'Usuario',
     required: [true, 'Debe de enviar el usuario quien creo el avance.']
},

});


//Se define la interfaz de Obra
interface Iobra extends Document {    
    identObra: String;
    nombreObra: String;
    descripcion:  String;
    fechaInicio: Date;
    fechaFin: Date;
    regPlano: String;
    cliente: String;
    activo: Boolean;
}


//Se exporta el modelo de Obra
export const Obra = model<Iobra>('Obra', obraSchema);