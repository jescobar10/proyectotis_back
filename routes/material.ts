import { Router, Request, Response  } from "express";
import { Material } from '../models/material.model';
import Token from '../classes/token';

const materialRoutes = Router();

//Listar los materiales paginadas
materialRoutes.get('/', async ( req: Request, res: Response ) =>{

    //Se solicita el numero de pagina , parametro opcional
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const body = req.body;

    const materiales =  await Material.find( {activo: body.activo} )
                                    //Muestra ordenado por las referencia
                                    .sort( { referencia: 1 } )
                                    .skip( skip )
                                    //Se pagina de 10 en 10 
                                    .limit(10)
                                    .exec();

    res.json({
        ok: true,
        pagina,
        materiales
    });
});

//Servicio Crear Materiales
materialRoutes.post('/create', ( req: Request, res: Response ) =>{

    const material = {               
        codigo         : req.body.codigo,
        referencia     : req.body.referencia,
        unidadMedida   : req.body.unidadMedida,
        precio         : req.body.precio,
        activo         : req.body.activo
    };

      //Se crea el obra en Base de datos
      Material.create( material ).then( materialDB => {

        const tokenUser = Token.getJwtToken({
                    _id: materialDB._id,                   
                    codigo: materialDB.codigo,
                    referencia: materialDB.referencia,
                    unidadMedida: materialDB.unidadMedida,
                    precio: materialDB.precio,                    
                    activo: materialDB.activo                       
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


//Actualizar Materiales
materialRoutes.post('/update', (req: any, res: Response) => {
    //userRoutes.post('/update', verificaToken,  (req: any, res: Response) => {

    const material = {
        codigo: req.body.codigo || req.material.codigo,
        referencia: req.body.referencia || req.material.referencia,
        unidadMedida: req.body.unidadMedida || req.material.unidadMedida,
        precio: req.body.precio || req.obra.precio,
        activo: req.body.activo || req.trabajador.activo        
    }

    // Se entrega la información para actualizar 
    Material.findByIdAndUpdate( req.obra._id, material, { new: true }, ( err, materialDB) => {
        
        if( err ) throw err;

        if( !materialDB  ) {
            return res.json({
                ok: false,
                mensaje: 'No existe un material con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: materialDB._id,                   
            codigo: materialDB.codigo,
            referencia: materialDB.referencia,
            unidadMedida: materialDB.unidadMedida,
            precio: materialDB.precio,                    
            activo: materialDB.activo                       
        });

        res.json({
            ok: true,
            token: tokenUser
        });

    });   
});

//Eliminar materiales
//En este caso no se eliminara el registro si no que se pondra en un estado de inactivo
materialRoutes.post('/delete', (req: any, res: Response) => {
    //userRoutes.post('/delete', verificaToken,  (req: any, res: Response) => {

    const obra = {
        _id: req.body._id || req.material._id,        
        activo: req.body.activo || req.material.activo
    }

    // Se entrega la información para actualizar el campo activo a false
    Material.findByIdAndUpdate( req.material._id, obra, { new: true }, ( err, materialDB) => {
        
        if( err ) throw err;

        if( !materialDB  ) {
            return res.json({
                ok: false,
                mensaje: 'No existe un material con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: materialDB._id,
                    documento: materialDB.codigo,
                    activo: false  
        });

        res.json({
            ok: true,
            token: tokenUser
        });
    });   
});

//Se exporta la ruta de los materiales
export default materialRoutes;
