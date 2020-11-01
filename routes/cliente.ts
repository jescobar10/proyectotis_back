import { Router, Request, Response  } from "express";
import { Cliente } from '../models/cliente.model';
import Token from '../classes/token';

const clienteRoutes = Router();

//Listar clientes paginados
clienteRoutes.get('/', async ( req: Request, res: Response ) =>{

    //Se solicita el numero de pagina , parametro opcional
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const body = req.body;

    const clientes =  await Cliente.find( {activo: body.activo} )
                                    //Muestra ordenado por nombre
                                    .sort( { nombre: 1 } )
                                    .skip( skip )
                                    //Se pagina de 10 en 10 
                                    .limit(10)
                                    .exec();

    res.json({
        ok: true,
        pagina,
        clientes
    });
});

//Servicio Crear clientes
clienteRoutes.post('/create', ( req: Request, res: Response ) =>{

    const cliente = {
        tipo              : req.body.tipo, 
        identificacion    : req.body.identificacion,        
        nombre            : req.body.nombre,       
        telefono          : req.body.telefono,
        email             : req.body.email,
        direccion         : req.body.direccion,        
        activo            : req.body.activo       
    };

      //Se crea el cliente en Base de datos
      Cliente.create( cliente ).then( clienteDB => {

        const tokenUser = Token.getJwtToken({
                    _id               : clienteDB._id,
                    tipo              : clienteDB.tipo, 
                    identificacion    : clienteDB.identificacion,        
                    nombre            : clienteDB.nombre,       
                    telefono          : clienteDB.telefono,
                    email             : clienteDB.email,
                    direccion         : clienteDB.direccion,        
                    activo            : clienteDB.activo                                      
                     
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


//Actualizar Cliente
clienteRoutes.post('/update', (req: any, res: Response) => {
    //userRoutes.post('/update', verificaToken,  (req: any, res: Response) => {

    const cliente = {
        tipo: req.body.tipo || req.cliente.tipo,
        identificacion: req.body.identificacion || req.cliente.identificacion,
        nombre: req.body.nombre || req.cliente.nombre,      
        telefono: req.body.telefono || req.cliente.telefono,
        email: req.body.email || req.cliente.email,
        direccion: req.body.direccion || req.cliente.direccion,       
        activo: req.body.obra || req.cliente.obra        
    }

    // Se entrega la información para actualizar 
    Cliente.findByIdAndUpdate( req.trabajador._id, cliente, { new: true }, ( err, clienteDB) => {
        
        if( err ) throw err;

        if( !clienteDB  ) {
            return res.json({
                ok: false,
                mensaje: 'No existe un cliente con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id               : clienteDB._id,
            tipo              : clienteDB.tipo, 
            identificacion    : clienteDB.identificacion,        
            nombre            : clienteDB.nombre,       
            telefono          : clienteDB.telefono,
            email             : clienteDB.email,
            direccion         : clienteDB.direccion,        
            activo            : clienteDB.activo                                      
             
});

        res.json({
            ok: true,
            token: tokenUser
        });

    });   
});

//Eliminar Cliente
//En este caso no se eliminara el registro si no que se pondra en un estado de inactivo
clienteRoutes.post('/delete', (req: any, res: Response) => {
    //userRoutes.post('/delete', verificaToken,  (req: any, res: Response) => {

    const cliente = {
        _id: req.body._id || req.cliente._id,        
        activo: req.body.activo || req.cliente.activo
    }

    // Se entrega la información para actualizar el campo activo a false
    Cliente.findByIdAndUpdate( req.trabajador._id, cliente, { new: true }, ( err, clienteDB) => {
        
        if( err ) throw err;

        if( !clienteDB  ) {
            return res.json({
                ok: false,
                mensaje: 'No existe un cliente con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: clienteDB._id,
                    documento: clienteDB.identificacion,
                    activo: false  
        });

        res.json({
            ok: true,
            token: tokenUser
        });
    });   
});

//Se exporta la ruta de Clientes
export default clienteRoutes;
