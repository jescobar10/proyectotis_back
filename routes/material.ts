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

    const materiales =  await Material.find(  )
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

//Listar los materiales paginadas
materialRoutes.get('/:id', async ( req: Request, res: Response ) =>{
    let id = req.params.id;
    await Material.findOne({codigo:id}, (err,materialDB) => {
        if (err)
            throw err;

        if(!materialDB){
            return res.json({
                ok: false,
                mensaje: `No existe un material registrado con el id ${ id }`
            });
        }

        const material = {               
            codigo         : materialDB.codigo,
            referencia     : materialDB.referencia,
            unidadMedida   : materialDB.unidadMedida,
            precio         : materialDB.precio,
            cantidad       : materialDB.cantidad,
            proveedor      : materialDB.proveedor,
            activo         : materialDB.activo
        };

        return res.json({
            ok: true,
            material
        })
    });
});


//Servicio Crear Materiales
materialRoutes.post('/create', ( req: Request, res: Response ) =>{

    const material = {               
        codigo         : req.body.codigo,
        referencia     : req.body.referencia,
        unidadMedida   : req.body.unidadMedida,
        precio         : req.body.precio,
        cantidad       : req.body.cantidad,
        proveedor      : req.body.proveedor,
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
                    cantidad: materialDB.cantidad,   
                    proveedor: materialDB.proveedor,               
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

    //Buscamos que exista el Material
    Material.findById({_id:req.body._id}, (err,materialDB) => {
        // Si no se puede procesar el query se arroja un error
        if(err)
            throw err;

        // Si el Material no existe en la BD no se procede con la petición
        if(!materialDB){
            return res.json({
                ok: false,
                mensaje: `No existe el material con _id ${req.body._id}`
            });
        };

        if(!req.body.activo && !materialDB.activo){
            return res.json({
                ok: false,
                mensaje: `El material con _id ${req.body._id} no está activo`
            });
        }

    const material = {
        codigo: req.body.codigo || materialDB.codigo,
        referencia: req.body.referencia || materialDB.referencia,
        unidadMedida: req.body.unidadMedida || materialDB.unidadMedida,
        precio: req.body.precio || materialDB.precio,
        cantidad: req.body.cantidad || materialDB.cantidad,
        proveedor: req.body.proveedor || materialDB.proveedor,
        activo: req.body.activo || materialDB.activo        
    }

    // Se entrega la información para actualizar 
    Material.findByIdAndUpdate( req.body._id, material, { new: true }, ( err, materialDB) => {
        
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
            cantidad: materialDB.cantidad,
            proveedor: materialDB.proveedor,
            precio: materialDB.precio,                    
            activo: materialDB.activo                       
        });

        res.json({
            ok: true,
            token: tokenUser
        });

    });

    });   
});

//Eliminar materiales
//En este caso no se eliminara el registro si no que se pondra en un estado de inactivo
// materialRoutes.post('/delete', (req: any, res: Response) => {
//     //userRoutes.post('/delete', verificaToken,  (req: any, res: Response) => {

//     const obra = {
//         _id: req.body._id || req.material._id,        
//         activo: req.body.activo || req.material.activo
//     }

//     // Se entrega la información para actualizar el campo activo a false
//     Material.findByIdAndUpdate( req.material._id, obra, { new: true }, ( err, materialDB) => {
        
//         if( err ) throw err;

//         if( !materialDB  ) {
//             return res.json({
//                 ok: false,
//                 mensaje: 'No existe un material con ese ID'
//             });
//         }

//         const tokenUser = Token.getJwtToken({
//             _id: materialDB._id,
//                     documento: materialDB.codigo,
//                     activo: false  
//         });

//         res.json({
//             ok: true,
//             token: tokenUser
//         });
//     });   
// });

//Se exporta la ruta de los materiales
export default materialRoutes;
