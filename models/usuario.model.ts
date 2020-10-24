
import {  Schema, model, Document }  from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema( {

    documento: {
        type: String,
        //unique: true,
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
        type: Number    
    },

    email: {
        type: String,
        unique: true,
        required: [ true, 'El Email es necesario ']
    },

    rol: {
        type: String,
        required: [ true, 'El Rol es necesario ']
    },

    usuarioPlataforma: {
        type: String
    },

    password: {
        type: String,
        required: [ true, 'La contraseña es necesaria ']
    }

    // fechaNacimiento: {
    //     type: Date        
    // }
    
    // avatar: {
    //     type: String, 
    //     default: 'av-1.png'
    // }

});


//Metodo para comparar contraseña
usuarioSchema.method('compararPassword', function( password: string = ''): boolean{

    if( bcrypt.compareSync( password, this.password ) ) {
        return true;
    } else {
        return false;
    }
});


//Se define la interfaz de Usuario
interface Iusuario extends Document {
    documento: String;
    nombre:  String;
    apellido: String;
    genero: String;
    telefono: String;
    email: String;
    rol: String;
    usuarioPlataforma: String;
    password: String;
    //fechaNacimiento: Date;
    //avatar: String

    //Se declara en la interfaz para acceder desde afuera 
    compararPassword(password: string): boolean;

}


//Se exporta el modelo de usuarios
export const Usuario = model<Iusuario>('Usuario', usuarioSchema);