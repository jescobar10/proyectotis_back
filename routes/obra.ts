import { Router, Request, Response  } from "express";
import { Obra } from '../models/obra.model';
import Token from '../classes/token';

const obraRoutes = Router();

//Listar las obras paginadas
obraRoutes.get('/', async ( req: Request, res: Response ) =>{

    //Se solicita el numero de pagina , parametro opcional
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const body = req.body;

    const obras =  await Obra.find(  )
                                    //Muestra ordenado por nombre de la obra
                                    .sort( { nombreObra: 1 } )
                                    .skip( skip )
                                    //Se pagina de 10 en 10 
                                    .limit(10)
                                    .exec();

    res.json({
        ok: true,
        pagina,
        obras
    });
});

//Servicio Crear Obras
obraRoutes.post('/create', ( req: Request, res: Response ) =>{

    const obra = {               
        identObra         : req.body.identObra,
        nombreObra        : req.body.nombreObra,
        descripcion       : req.body.descripcion,
        fechaInicio       : req.body.fechaInicio,
        fechaFin          : req.body.fechaFin,
        regPlano          : req.body.regPlano,       
        activo            : req.body.activo       
    };

      //Se crea el obra en Base de datos
      Obra.create( obra ).then( obraDB => {

        const tokenUser = Token.getJwtToken({
                    _id: obraDB._id,                   
                    identObra: obraDB.identObra,
                    nombreObra: obraDB.nombreObra,
                    descripcion: obraDB.descripcion,
                    fechaInicio: obraDB.fechaInicio,
                    fechaFin: obraDB.fechaFin,
                    regPlano: obraDB.regPlano,
                    activo: obraDB.activo                       
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


//Actualizar Obra
obraRoutes.post('/update', (req: any, res: Response) => {
    //userRoutes.post('/update', verificaToken,  (req: any, res: Response) => {

    //Buscamos que exista la obra
    Obra.findById({_id:req.body._id}, (err,obraDB) => {
        // Si no se puede procesar el query se arroja un error
        if(err)
            throw err;

        // Si la Obra no existe en la BD no se procede con la petición
        if(!obraDB){
            return res.json({
                ok: false,
                mensaje: `No existe la obra con _id ${req.body._id}`
            });
        };

        if(!req.body.activo && !obraDB.activo){
            return res.json({
                ok: false,
                mensaje: `La obra con _id ${req.body._id} no está activa`
            });
        }


    const obra = {
        identObra: req.body.identObra || obraDB.identObra,
        nombreObra: req.body.nombreObra || obraDB.nombreObra,
        descripcion: req.body.descripcion || obraDB.descripcion,
        fechaInicio: req.body.fechaInicio || obraDB.fechaInicio,
        fechaFin: req.body.fechaFin || obraDB.fechaFin,
        regPlano: req.body.regPlano || obraDB.regPlano,          
        activo: req.body.activo || obraDB.activo       
    }

    // Se entrega la información para actualizar 
    Obra.findByIdAndUpdate( req.obra._id, obra, { new: true }, ( err, obraDB) => {
        
        if( err ) throw err;

        if( !obraDB  ) {
            return res.json({
                ok: false,
                mensaje: 'No existe una obra con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: obraDB._id,                   
            identObra: obraDB.identObra,
            nombreObra: obraDB.nombreObra,
            descripcion: obraDB.descripcion,
            fechaInicio: obraDB.fechaInicio,
            fechaFin: obraDB.fechaFin,
            regPlano: obraDB.regPlano,
            activo: obraDB.activo                       
});

        res.json({
            ok: true,
            token: tokenUser
        });

    });  

    });   
});

//Eliminar Obra
//En este caso no se eliminara el registro si no que se pondra en un estado de inactivo
obraRoutes.post('/delete', (req: any, res: Response) => {
    //userRoutes.post('/delete', verificaToken,  (req: any, res: Response) => {

    const obra = {
        _id: req.body._id || req.obra._id,        
        activo: req.body.activo || req.obra.activo
    }

    // Se entrega la información para actualizar el campo activo a false
    Obra.findByIdAndUpdate( req.trabajador._id, obra, { new: true }, ( err, obraDB) => {
        
        if( err ) throw err;

        if( !obraDB  ) {
            return res.json({
                ok: false,
                mensaje: 'No existe una obra con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: obraDB._id,
                    documento: obraDB.identObra,
                    activo: false  
        });

        res.json({
            ok: true,
            token: tokenUser
        });
    });   
});

//Se exporta la ruta de las obras
export default obraRoutes;

