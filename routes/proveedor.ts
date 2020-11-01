import { Router, Request, Response  } from "express";
import { Proveedor } from '../models/proveedor.model';
import Token from '../classes/token';

const proveedorRoutes = Router();

//Listar Proveedor paginados
proveedorRoutes.get('/', async ( req: Request, res: Response ) =>{

    //Se solicita el numero de pagina , parametro opcional
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const body = req.body;

    const proveedores =  await Proveedor.find( {activo: body.activo} )
                                    //Muestra ordenado por nombre
                                    .sort( { nombre: 1 } )
                                    .skip( skip )
                                    //Se pagina de 10 en 10 
                                    .limit(10)
                                    .exec();

    res.json({
        ok: true,
        pagina,
        proveedores
    });
});

//Servicio Crear Proveedor
proveedorRoutes.post('/create', ( req: Request, res: Response ) =>{

    const proveedor = {
        tipo              : req.body.tipo,        
        identificacion    : req.body.identicacion,
        nombre            : req.body.nombre,
        repreLegal        : req.body.repreLegal,
        telefono          : req.body.telefono,
        email             : req.body.email,
        direccion         : req.body.direccion,
        activo            : req.body.activo
       
    };

      //Se crea el proveedor en Base de datos
      Proveedor.create( proveedor ).then( proveedorDB => {

        const tokenUser = Token.getJwtToken({
                    _id: proveedorDB._id,
                    tipo: proveedorDB.tipo,
                    identificacion: proveedorDB.identificacion,
                    nombre: proveedorDB.nombre,
                    repreLegal:  proveedorDB.repreLegal,
                    telefono: proveedorDB.telefono,
                    email: proveedorDB.email,
                    direccion: proveedorDB.direccion,
                    activo:  proveedorDB.activo        
         });

        res.json ({
          ok: true,
          token: tokenUser
        });
       
    }).catch( err => {
        res.json( {
            ok: false,
            err
        })
    });
});


//Actualizar proveedor
proveedorRoutes.post('/update', (req: any, res: Response) => {
    //userRoutes.post('/update', verificaToken,  (req: any, res: Response) => {

    const proveedor = {
        tipo: req.body.tipo || req.proveedor.tipo,             
        identificacion: req.body.identificacion || req.proveedor.identificacion,
        nombre: req.body.nombre || req.proveedor.nombre,
        repreLegal: req.body.repreLegal || req.trabajador.repreLegal,
        telefono: req.body.telefono || req.trabajador.telefono,
        email: req.body.email || req.trabajador.email,
        direccion: req.body.direccion || req.trabajador.direccion,
        activo: req.body.activo || req.trabajador.activo               
    }

    // Se entrega la información para actualizar 
    Proveedor.findByIdAndUpdate( req.proveedor._id, proveedor, { new: true }, ( err, proveedorDB) => {
        
        if( err ) throw err;

        if( !proveedorDB  ) {
            return res.json({
                ok: false,
                mensaje: 'No existe un proveedor con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: proveedorDB._id,
                    tipo: proveedorDB.tipo,
                    identificacion: proveedorDB.identificacion,
                    nombre: proveedorDB.nombre,
                    repreLegal: proveedorDB.repreLegal,
                    telefono: proveedorDB.telefono,
                    email: proveedorDB.email,
                    direccion: proveedorDB.direccion,
                    activo: proveedorDB.activo
        });

        res.json({
            ok: true,
            token: tokenUser
        });

    });   
});

//Eliminar proveedor
//En este caso no se eliminara el registro si no que se pondra en un estado de inactivo
proveedorRoutes.post('/delete', (req: any, res: Response) => {
    //userRoutes.post('/delete', verificaToken,  (req: any, res: Response) => {

    const user = {
        _id: req.body._id || req.proveedor._id,        
        activo: req.body.activo || req.proveedor.activo
    }

    // Se entrega la información para actualizar el campo activo a false
    Proveedor.findByIdAndUpdate( req.proveedor._id, user, { new: true }, ( err, proveedorDB) => {
        
        if( err ) throw err;

        if( !proveedorDB  ) {
            return res.json({
                ok: false,
                mensaje: 'No existe un trabajador con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: proveedorDB._id,
                    documento: proveedorDB.identificacion,
                    activo: false  
        });

        res.json({
            ok: true,
            token: tokenUser
        });
    });   
});

//Se exporta la ruta de proveedores
export default proveedorRoutes;


