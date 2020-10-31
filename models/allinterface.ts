//Interfaz Modulo de Usuario
interface usuario {
    documento: String;
    nombre:  String;
    apellido: String;
    genero: String;
    telefono: String;
    email: String;
    rol: String;  
    password: String;
    activo: boolean   
}

//Interfaz modulo de Trabajadores
interface Trabajador {
    documento: String;
    nombre:  String;
    apellido: String;
    genero: String;
    telefono: String;
    email: String;
    direccion: string;
    cargo: String;
    obra: String;   
    activo: boolean;     
}

//Interfaz modulo de Proveedor
interface Proveedor {
    tipo: String; 
    identificacion: String;
    nombre:  String;   
    repreLegal: String;
    telefono: String;
    email: String;
    direccion: string;    
    //obra: String;   
    activo: boolean;     
}


//Interfaz modulo de Clientes
interface Cliente {
    tipo: String; 
    identificacion: String;
    nombre:  String;   
    telefono: String;
    email: String;
    direccion: string;    
    //obra: String;   
    activo: boolean;     
}

//Interfaz modulo de Obra
interface Iobra {
    codigo: String; 
    identObra: String;
    nombreObra: String;
    descripcion:  String;
    fechaInicio: Date;
    fechaFin: Date;
    regPlano: Date;
    activo: Date;         
}

//Iterfaz modelo de Materiales
interface Material {
    codigo: String; 
    referencia: String;
    unidadMedida: String;
    precio: number       
}

//Interface Modelo avance de obra
interface AvanceObra {
    idObra: string;
    fechaAvance: Date;
    descripcion: string;
    foto: string[];
    coords: string;
    plano: string;
    usuario: string;
    created: Date;
}