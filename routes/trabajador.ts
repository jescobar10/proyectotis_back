import { Router, Request, Response  } from "express";
import { Trabajador } from '../models/trabajador.model';
import Token from '../classes/token';

const trabajadorRoutes = Router();

//Listar trabajadores paginados
trabajadorRoutes.get('/', async ( req: Request, res: Response ) =>{

    //Se solicita el numero de pagina , parametro opcional
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const body = req.body;

    const trabajadores =  await Trabajador.find( {activo: body.activo} )
                                    //Muestra ordenado por nombre
                                    .sort( { nombre: 1 } )
                                    .skip( skip )
                                    //Se pagina de 10 en 10 
                                    .limit(10)
                                    .exec();

    res.json({
        ok: true,
        pagina,
        trabajadores
    });
});

//Servicio Crear Trabajador
trabajadorRoutes.post('/create', ( req: Request, res: Response ) =>{

    const trabajador = {
        documento         : req.body.documento,        
        nombre            : req.body.nombre,
        apellido          : req.body.apellido,
        genero            : req.body.genero,
        telefono          : req.body.telefono,
        email             : req.body.email,
        direccion         : req.body.direccion,
        cargo             : req.body.cargo,
        obra              : req.body.obra,
        activo            : req.body.activo
       
    };

      //Se crea el trabajador en Base de datos
      Trabajador.create( trabajador ).then( trabajadorDB => {

        const tokenUser = Token.getJwtToken({
                    _id: trabajadorDB._id,
                    documento: trabajadorDB.documento,
                    nombre: trabajadorDB.nombre,
                    apellido: trabajadorDB.apellido,
                    genero: trabajadorDB.genero,
                    telefono: trabajadorDB.telefono,
                    email: trabajadorDB.email,
                    direccion: trabajadorDB.direccion,
                    cargo: trabajadorDB.cargo,
                    obra: trabajadorDB.obra,
                    activo: trabajadorDB.activo                   
                     
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


//Actualizar Trabajador
trabajadorRoutes.post('/update', (req: any, res: Response) => {
    //userRoutes.post('/update', verificaToken,  (req: any, res: Response) => {

    const trabajador = {
        documento: req.body.documento || req.trabajador.documento,
        nombre: req.body.nombre || req.trabajador.nombre,
        apellido: req.body.apellido || req.trabajador.apellido,
        genero: req.body.genero || req.trabajador.genero,
        telefono: req.body.telefono || req.trabajador.telefono,
        email: req.body.email || req.trabajador.email,
        direccion: req.body.direccion || req.trabajador.direccion,        
        cargo: req.body.cargo || req.trabajador.cargo,  
        obra: req.body.obra || req.trabajador.obra, 
        activo: req.body.obra || req.trabajador.obra        
    }

    // Se entrega la información para actualizar 
    Trabajador.findByIdAndUpdate( req.trabajador._id, trabajador, { new: true }, ( err, trabajadorDB) => {
        
        if( err ) throw err;

        if( !trabajadorDB  ) {
            return res.json({
                ok: false,
                mensaje: 'Noexiste un usuario con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: trabajadorDB._id,
                    documento: trabajadorDB.documento,
                    nombre: trabajadorDB.nombre,
                    apellido: trabajadorDB.apellido,
                    genero: trabajadorDB.genero,
                    telefono: trabajadorDB.telefono,
                    email: trabajadorDB.email,
                    direccion: trabajadorDB.direccion,                   
                    cargo: trabajadorDB.cargo,
                    obra:  trabajadorDB.obra,
                    activo: trabajadorDB.activo
        });

        res.json({
            ok: true,
            token: tokenUser
        });

    });   
});

//Eliminar Trabajador
//En este caso no se eliminara el registro si no que se pondra en un estado de inactivo
trabajadorRoutes.post('/delete', (req: any, res: Response) => {
    //userRoutes.post('/delete', verificaToken,  (req: any, res: Response) => {

    const user = {
        _id: req.body._id || req.trabajador._id,        
        activo: req.body.activo || req.trabajador.activo
    }

    // Se entrega la información para actualizar el campo activo a false
    Trabajador.findByIdAndUpdate( req.trabajador._id, user, { new: true }, ( err, trabajadorDB) => {
        
        if( err ) throw err;

        if( !trabajadorDB  ) {
            return res.json({
                ok: false,
                mensaje: 'No existe un trabajador con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: trabajadorDB._id,
                    documento: trabajadorDB.documento,
                    activo: false  
        });

        res.json({
            ok: true,
            token: tokenUser
        });
    });   
});

//Se exporta la ruta de trabajadores
export default trabajadorRoutes;
