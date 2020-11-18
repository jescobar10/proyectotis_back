import {  Schema, model, Document }  from 'mongoose';
import { Proveedor } from './proveedor.model';

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
   },

   cantidad: {
        type: Number,
        required: [ true, 'La cantidad es necesaria.']
   },

   proveedor: {
        type: Schema.Types.ObjectId,
        ref: "Proveedor",
        required: [ true, 'Debe de existir una referencia a un proveedor']
   },

   activo: {
       type: Boolean
   }

});


//Se define la interfaz de Materiales
interface Imateriales extends Document {
    codigo: String; 
    referencia: String;
    unidadMedida: String;
    precio: Number;
    cantidad: Number;
    proveedor: string;
    activo: Boolean;      
}


//Se exporta el modelo de Material
export const Material = model<Imateriales>('Materiales', materialSchema);