import {  Schema, model, Document }  from 'mongoose';


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
   regPlano: {
        type: String
   },

   activo: {
    type: Boolean
}

});


//Se define la interfaz de Obra
interface Iobra extends Document {    
    identObra: String;
    nombreObra: String;
    descripcion:  String;
    fechaInicio: Date;
    fechaFin: Date;
    regPlano: String;
    activo: Boolean;
}


//Se exporta el modelo de Obra
export const Obra = model<Iobra>('Obra', obraSchema);