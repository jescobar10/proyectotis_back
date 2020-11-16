import {  Schema, model, Document }  from 'mongoose';

const trabajadorSchema = new Schema( {

    documento: {
        type: String,
        unique: true,
        required: [ true, 'El Documento es necesario ']
    },

    nombre: {
        type: String,
        required: [ true, 'El Nombre es necesario ']
    },

    apellido: {
        type: String,
        required: [ true, 'El apellido es necesario ']
    },

    genero: {
        type: String,
        required: [ true, 'El genero es necesario ']
    },

    telefono: {
        type: Number,
        required: [true, 'El telefono es necesario para contactar al trabajador']
    },

    email: {
        type: String,        
        required: [ true, 'El Email es necesario ']
    },

    direccion: {
        type: String
        //required: [ true, 'El genero es necesario ']
    },

    cargo: {
        type: String,
        required: [ true, 'El Cargo es necesario ']
    }, 
    //Creo que esto va en un modulo donde se asignan obras a los trabajadores 
    // obra: {
    //     type: String 
    // },

    activo: {
        type: Boolean
    }

});


//Se define la interfaz de Trabajadores
interface Itrabajador extends Document {
    documento: String;
    nombre:  String;
    apellido: String;
    genero: String;
    telefono: String;
    email: String;
    direccion: string;
    cargo: String;
    //obra: String;   
    activo: boolean;
}


//Se exporta el modelo de Trabajador
export const Trabajador = model<Itrabajador>('Trabajador', trabajadorSchema);