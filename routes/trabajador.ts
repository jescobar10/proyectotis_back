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

    const trabajadores =  await Trabajador.find()
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
        //obra              : req.body.obra,
        activo            : req.body.activo
    };

      //Se crea el trabajador en Base de datos
      Trabajador.create( trabajador ).then( trabajadorDB => {

        const tokenTrabajador = Token.getJwtToken({
                    _id: trabajadorDB._id,
                    documento: trabajadorDB.documento,
                    nombre: trabajadorDB.nombre,
                    apellido: trabajadorDB.apellido,
                    genero: trabajadorDB.genero,
                    telefono: trabajadorDB.telefono,
                    email: trabajadorDB.email,
                    direccion: trabajadorDB.direccion,
                    cargo: trabajadorDB.cargo,
                    //obra: trabajadorDB.obra,
                    activo: trabajadorDB.activo                   
                     
        });

        res.json ({
          ok: true,
          token: tokenTrabajador
        });
       
    }).catch( err => {
        res.json( {
            ok: false,
            err
        })
    });
});

//Retornar trabajador por documento
trabajadorRoutes.get('/:documento', (req: Request, res: Response) => {
    let documento = req.params.documento;
    Trabajador.findOne({documento}, (err,trabajadorDB) => {
        if(err)
            throw err;

        if(!trabajadorDB){
            return res.json({
                ok: false,
                mensaje: `No existe un trabajador con documento ${documento}`
            });
        }

        if(trabajadorDB.activo) {

            let trabajador = {
                _id: trabajadorDB._id,
                documento: trabajadorDB.documento,
                nombre: trabajadorDB.nombre,
                apellido: trabajadorDB.apellido,
                genero: trabajadorDB.genero,
                telefono: trabajadorDB.telefono,
                email: trabajadorDB.email,
                direccion: trabajadorDB.direccion,
                cargo: trabajadorDB.cargo,     
                activo: trabajadorDB.activo              
            };

            res.json ({
              ok: true,
              trabajador
            });

        }else {
            return res.json({
                ok: false,
                mensaje: `El trabajador con documento ${documento} no esta activo`
            });
        }      
    });
});

//Actualizar Trabajador
trabajadorRoutes.post('/update', (req: any, res: Response) => {
    //Buscamos que exista el usuario
    Trabajador.findById({_id:req.body._id}, (err,trabajadorDB) => {
        // Si no se puede procesar el query se arroja un error
        if(err)
            throw err;

        // Si el trabajador no existe en la BD no se procede con la petición
        if(!trabajadorDB){
            return res.json({
                ok: false,
                mensaje: `No existe el trabajador con _id ${req.body._id}`
            });
        };

        if(!req.body.activo && !trabajadorDB.activo){
            return res.json({
                ok: false,
                mensaje: `El trabajador con _id ${req.body._id} no está activo`
            });
        }

        const trabajador = {
            _id: req.body._id || trabajadorDB._id,
            documento: req.body.documento || trabajadorDB.documento,
            nombre: req.body.nombre || trabajadorDB.nombre,
            apellido: req.body.apellido || trabajadorDB.apellido,
            genero: req.body.genero || trabajadorDB.genero,
            telefono: req.body.telefono || trabajadorDB.telefono,
            email: req.body.email || trabajadorDB.email,
            direccion: req.body.direccion || trabajadorDB.direccion,
            cargo: req.body.cargo || trabajadorDB.cargo,
            activo: req.body.activo || trabajadorDB.activo
        }

        console.log(trabajador);
        
        Trabajador.updateOne( {_id:req.body._id}, trabajador, { new: true }, ( err, trabajadorUpdated) => {
        
            if( err ) throw err;

            const tokenTrabajador = Token.getJwtToken({
                        _id:trabajador._id,
                        documento:trabajador.documento,
                        nombre:trabajador.nombre,
                        apellido:trabajador.apellido,
                        genero:trabajador.genero,
                        telefono:trabajador.telefono,
                        email:trabajador.email,
                        direccion:trabajador.direccion,
                        cargo:trabajador.cargo,
                        activo:trabajador.activo  
            });
    
            res.json({
                ok: true,
                mensaje: `Se ha actualizado el trabajador con documento ${trabajador.documento}`,
                token: tokenTrabajador
            });
    
        });
    });
});



//Se exporta la ruta de trabajadores
export default trabajadorRoutes;
