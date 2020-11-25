"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    ;
    //guarda 
    guardarImagenTemporal(file, userId) {
        return new Promise((resolve, reject) => {
            // Crear carpetas
            const path = this.crearCarpetaUsuario(userId);
            // Nombre archivo
            const nombreArchivo = this.generarNombreUnico(file.name);
            console.log(file.name);
            console.log(nombreArchivo);
            // Mover el archivo del Temp a nuestra carpeta                             
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    //No se puede mover
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    //Crea un nombre unico para la imagen cargada
    generarNombreUnico(nombreOriginal) {
        // 6.copy.jpg
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        //Genera el Id unico 
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extension}`;
    }
    //Crea la acarpeta donde se van a guardar las imagenes de forma temporal
    crearCarpetaUsuario(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        // console.log(pathUser);
        const existe = fs_1.default.existsSync(pathUser);
        //Se crean los dos directorios
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    //Pasa las imagenes de TEMP hacias el modulo correspondiente
    imagenesDeTempHaciaModulo(userId, modulo) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads/', userId, modulo);
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagenesTemp = this.obtenerImagenesEnTemp(userId);
        imagenesTemp.forEach(imagen => {
            fs_1.default.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`);
        });
        return imagenesTemp;
    }
    imagenesDeTempHaciaUser() {
    }
    obtenerImagenesEnTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getFotoUrl(userId, img, modulo) {
        // Path POSTs
        const pathFoto = path_1.default.resolve(__dirname, '../uploads', userId, modulo, img);
        // Si la imagen existe
        const existe = fs_1.default.existsSync(pathFoto);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/400x250.jpg');
        }
        return pathFoto;
    }
}
exports.default = FileSystem;
