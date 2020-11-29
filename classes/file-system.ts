import { FileUpload } from '../interfaces/file-upload';

import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {

    constructor() { };

    //guarda la imagen temporalmente
    guardarImagenTemporal( file: FileUpload, userId: string) {

        return new Promise(  (resolve, reject) => {

            // Crear carpetas
            const path = this.crearCarpetaUsuario( userId );
    
            // Nombre archivo
            const nombreArchivo = this.generarNombreUnico( file.name );

            console.log(file.name);
            console.log(nombreArchivo);

             // Mover el archivo del Temp a nuestra carpeta                             
            file.mv( `${ path }/${ nombreArchivo }`, ( err: any) => {
    
                if ( err ) {
                    //No se puede mover
                    reject(err);
                } else {
                    resolve();
                }
    
            });

        });


    }


      //Crea un nombre unico para la imagen cargada
      private generarNombreUnico( nombreOriginal: string ) {
        // 6.copy.jpg
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[ nombreArr.length - 1 ];

        //Genera el Id unico 
        const idUnico = uniqid();

        return `${ idUnico }.${ extension }`;
    }


     //Crea la acarpeta donde se van a guardar las imagenes de forma temporal
     private crearCarpetaUsuario( userId: string ) {

        const pathUser = path.resolve(  __dirname, '../uploads/', userId );
        const pathUserTemp = pathUser + '/temp';
        // console.log(pathUser);

        const existe = fs.existsSync( pathUser );

        //Se crean los dos directorios
        if ( !existe ) {
            fs.mkdirSync( pathUser );
            fs.mkdirSync( pathUserTemp );
        }

        return pathUserTemp;

    }
     

    //Pasa las imagenes de TEMP hacias el modulo correspondiente
    imagenesDeTempHaciaModulo( userId: string, modulo: string ) {

        const pathTemp = path.resolve(  __dirname, '../uploads/', userId, 'temp' );
        const pathPost = path.resolve(  __dirname, '../uploads/', userId, modulo );

        if ( !fs.existsSync( pathTemp ) ) {
            return [];
        }

        if ( !fs.existsSync( pathPost ) ) {
            fs.mkdirSync( pathPost );
        }

        const imagenesTemp = this.obtenerImagenesEnTemp( userId );

        imagenesTemp.forEach( imagen => {
            fs.renameSync( `${ pathTemp }/${ imagen }`, `${ pathPost }/${ imagen }` )
        });

        return imagenesTemp;

    }

    imagenesDeTempHaciaUser()
    {
        
    }

    private obtenerImagenesEnTemp( userId: string ) {

        const pathTemp = path.resolve(  __dirname, '../uploads/', userId, 'temp' );

        return fs.readdirSync( pathTemp ) || [];

    }


    getFotoUrl( userId: string, img: string, modulo: string ) {

        // Path POSTs
        const pathFoto = path.resolve( __dirname, '../uploads', userId, modulo, img );

        // Si la imagen existe
        const existe = fs.existsSync( pathFoto );
        if ( !existe ) {
            return path.resolve( __dirname, '../assets/400x250.jpg' );
        }

        return pathFoto;
    }

    getPDFUrl( userId: string, pdf: string, modulo: string ) {

        // Path POSTs
        const pathFoto = path.resolve( __dirname, '../uploads', userId, modulo, pdf );

        // Si la imagen existe
        const existe = fs.existsSync( pathFoto );
        if ( !existe ) {
            return path.resolve( __dirname, '../assets/400x250.jpg' );
        }

        return pathFoto;
    }


}