import {  Schema, model, Document }  from 'mongoose';

const materialSchema = new Schema( {
    
    codigo: {
         type: String,
         unique: true,
         required: [ true, 'El codigo del material es necesario ']
    },

    referencia: {
        type: String,       
        required: [ true, 'La referencia o descripción del material es necesario ']
   },

   unidadMedida: {
    type: String
   },

   precio: {
       type:Number,
       required: [ true, 'El precio o valor del material es necesario.']
   }

});


//Se define la interfaz de Materiales
interface Imateriales extends Document {
    codigo: String; 
    referencia: String;
    unidadMedida: String;
    precio: number       
}


//Se exporta el modelo de Material
export const Material = model<Imateriales>('Materiales', materialSchema);