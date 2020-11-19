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

    const proveedores =  await Proveedor.find()
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

//Retornar proveedor por id
proveedorRoutes.get('/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    Proveedor.findOne({identificacion:id}, (err,proveedorDB) => {
        if(err)
            throw err;

        if(!proveedorDB){
            return res.json({
                ok: false,
                mensaje: `No existe proveedor con identificacion ${id}`
            });
        }

        if( proveedorDB.activo) {

            let proveedor = {
                tipo              : proveedorDB.tipo,        
                identificacion    : proveedorDB.identificacion,
                nombre            : proveedorDB.nombre,
                repreLegal        : proveedorDB.repreLegal,
                telefono          : proveedorDB.telefono,
                email             : proveedorDB.email,
                direccion         : proveedorDB.direccion,
                activo            : proveedorDB.activo
            };

            res.json ({
              ok: true,
              proveedor
            });

        }else {
            return res.json({
                ok: false,
                mensaje: `El proveedor con identificacion ${id} no esta activo`
            });
        }      
    });
});

//Servicio Crear Proveedor
proveedorRoutes.post('/create', ( req: Request, res: Response ) =>{

    const proveedor = {
        tipo              : req.body.tipo,        
        identificacion    : req.body.identificacion,
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
    //Buscamos que exista el proveedor
    Proveedor.findById({_id:req.body._id}, (err,proveedorDB) => {
        // Si no se puede procesar el query se arroja un error
        if(err)
            throw err;

        // Si el usuario no existe en la BD no se procede con la petición
        if(!proveedorDB){
            return res.json({
                ok: false,
                mensaje: `No existe el proveedor con _id ${req.body._id}`
            });
        };
        if(((!req.body.activo) || req.body.activo == 'false') && (!proveedorDB.activo)){
            return res.json({
                ok: false,
                mensaje: `El proveedor con _id ${req.body._id} no está activo`
            });
        }

        const proveedor = {
            tipo:  req.body.tipo || proveedorDB.tipo,
            identificacion:  req.body.identificacion || proveedorDB.identificacion,
            nombre:  req.body.nombre || proveedorDB.nombre,
            repreLegal:  req.body.repreLegal || proveedorDB.repreLegal,
            telefono:  req.body.telefono || proveedorDB.telefono,
            email:  req.body.email || proveedorDB.email,
            direccion:  req.body.direccion || proveedorDB.direccion,
            activo:  req.body.activo || proveedorDB.activo
        }

        console.log(proveedor);
        
        Proveedor.updateOne( {_id:req.body._id}, proveedor, { new: true }, ( err, proveedorUpdated) => {
        
            if( err ) throw err;

            const tokenProveedor = Token.getJwtToken({
                        tipo:proveedor.tipo,
                        identificacion:proveedor.identificacion,
                        nombre:proveedor.nombre,
                        repreLegal:proveedor.repreLegal,
                        telefono:proveedor.telefono,
                        email:proveedor.email,
                        direccion:proveedor.direccion,
                        activo:proveedor.activo
            });
    
            res.json({
                ok: true,
                mensaje: `Se ha actualizado el proveedor con documento ${proveedor.identificacion}`,
                token: tokenProveedor
            });
    
        });
    });
});

//Se exporta la ruta de proveedores
export default proveedorRoutes;


