import {  Schema, model, Document }  from 'mongoose';

const clienteSchema = new Schema( {

    //Natural / Juridica
    tipo: {
         type: String,
         required: [ true, 'El Tipo de cliente es necesario ']
    },

    identificacion: {
        type: String,
        unique: true,
        required: [ true, 'La identificacion es necesaria ']
    },

    nombre: {
        type: String,
        required: [ true, 'El Nombre es necesario ']
    },

    telefono: {
        type: Number,
        required: [ true, 'El Telefono es necesario ']    
    },

    email: {
        type: String,      
        required: [ true, 'El Email es necesario ']
    },

    direccion: {
        type: String
        //required: [ true, 'El genero es necesario ']
    },
    
    //Creo que esto va en un modulo donde se asignan obras a los clientes
    // obra: {
    //     type: String 
    // },

    activo: {
        type: Boolean
    }

});


//Se define la interfaz de Clientes
interface Icliente extends Document {
    tipo: String; 
    identificacion: String;
    nombre:  String;   
    telefono: String;
    email: String;
    direccion: string;    
    //obra: String;   
    activo: boolean;     
}


//Se exporta el modelo de Clientes
export const Cliente = model<Icliente>('Cliente', clienteSchema);