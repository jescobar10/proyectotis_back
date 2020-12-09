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
    activo: Boolean   
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
    activo: Boolean;     
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
    activo: Boolean;     
}


//Interfaz modulo de Clientes
interface Cliente {
    tipo: String; 
    identificacion: String;
    nombre:  String;   
    telefono: String;
    email: String;
    direccion: String;    
    activo: Boolean;     
}

//Interfaz modulo de Obra
interface obra {   
    identObra: String;
    nombreObra: String;
    descripcion:  String;
    fechaInicio: Date;
    fechaFin: Date;
    regPlano: String;
    //cliente: String;
    activo: Boolean;         
}

//Iterfaz modelo de Materiales
interface Material {
    codigo: String; 
    referencia: String;
    unidadMedida: String;
    precio: Number;
    activo: Boolean;
}

//Interface Modelo avance de obra
interface AvanceObra {
    idObra: String;
    fechaAvance: Date;
    descripcion: String;
    foto: String[];
    coords: String;
    plano: String;
    usuario: String;
    created: Date;
}

//Interface Modelo material salida
interface MaterialSalida {
    idMaterial: String;
    idObra: String;
    fecha: String;
    cantidad: Number;
}

//Interface Modelo material entrada
interface MaterialEntrada {
    idMaterial: String;
    idProveedor: String;
    fecha: String;
    cantidad: Number;
}

interface TrabajadorObra {
    idTrabajador: String;
    idObra: String;
    fecha: String;
}