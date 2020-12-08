import { Router, Request, Response  } from "express";
import { Obra } from '../models/obra.model';
import Token from '../classes/token';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';
import { verificaToken } from '../middlewares/autenticacion';
import { Cliente } from '../models/cliente.model';

const obraRoutes = Router();
//Se define el filesystem que va a permitir subir los archivos img / pdf
const fileSystem = new FileSystem();

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

//Listar las obras para drop
obraRoutes.get('/listarObras', async ( req: Request, res: Response ) =>{
  
    const body = req.body;

    const obras =  await Obra.find(  )
                                    //Muestra ordenado por nombre de la obra
                                    .sort( { nombreObra: 1 } )                  
                                    .exec();

    res.json({      
        obras
    });
});

//Servicio Crear Obras
obraRoutes.post('/', [verificaToken], async( req: any, res: Response ) =>{

    console.log('Ingreso al guardar obra');

    const body = req.body;
    body.usuario = req.usuario._id;
    const clienteId = body.cliente;

    const cliente = await Cliente.findOne({_id:clienteId})
    .then(clienteDB => {
        console.log(clienteDB);
        return clienteDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    })

    if(!cliente){
        return res.json({
            ok:false,
            mensaje:`Ha existido un error con el ciente _id: ${ clienteId }`
        });
    }
       
    //Para subir varios archivos 
    const pdfs =  fileSystem.imagenesDeTempHaciaModulo( req.usuario._id, "obra" );

    console.log('Nombre de Pdf cargado: ' + pdfs);

    body.regPlano = pdfs;

    console.log('objeto enviado: ' + body );

    //Se crea el obra en Base de datos
    Obra.create( body ).then( async obraDB => {
        
        await obraDB.populate('usuario', '-password').execPopulate();
      
        res.json({
            ok: true,
            obra: obraDB._id
        });
        
    }).catch( err => {
        res.json( {
            ok: false,
            err
        })
    });
});


///Se definen las rutas o servicios para subir archivos ( pdf)
obraRoutes.post('/uploadpdf', [ verificaToken ], async (req: any, res: Response) =>  {
    
    console.log('Back Archivos Subidos : ' + req.files );
    console.log('Back Archivos Req : ' + req.pdf );

    //Se valida si viene algun archivo 
    if( !req.files ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }

    //Se sube el archivo
    const file: FileUpload = req.files.pdf;

    if( !file ) {
        return res.status(400).json({
            mensaje: 'No se subio ningun archivo'
        });
    }

    //si no es ni imagen ni pdf
    if( !file.mimetype.includes('pdf')){
        return res.status(400).json({
            mensaje: 'Lo que subio no es un pdf'
        });
    }

   await fileSystem.guardarImagenTemporal( file, req.usuario._id );
   
    res.json({
        ok: true,
        file: file.mimetype
    });
});

obraRoutes.get('/pdf/:obraid/:pdf', (req: any, res: Response ) => {

    const obraid = req.params.obraid;
    const pdf = req.params.pdf;

    const pathPDF = fileSystem.getPDFUrl( obraid, pdf, "obra" );

    res.sendFile( pathPDF );

});


//Actualizar Obra
obraRoutes.post('/update', (req: any, res: Response) => {
    //userRoutes.post('/update', verificaToken,  (req: any, res: Response) => {

    //Buscamos que exista la obra
    Obra.findById({_id:req.body._id}, async (err,obraDB) => {
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
        cliente: req.body.cliente || obraDB.cliente,         
        activo: req.body.activo || obraDB.activo       
    }

    const cliente = await Cliente.findOne({_id:obra.cliente})
    .then(clienteDB => {
        console.log(clienteDB);
        return clienteDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    })

    if(!cliente){
        return res.json({
            ok:false,
            mensaje:`Ha existido un error con el ciente _id: ${ obra.cliente }`
        });
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

        const tokenObra = Token.getJwtToken({
            _id: obraDB._id,                   
            identObra: obraDB.identObra,
            nombreObra: obraDB.nombreObra,
            descripcion: obraDB.descripcion,
            fechaInicio: obraDB.fechaInicio,
            fechaFin: obraDB.fechaFin,
            regPlano: obraDB.regPlano,
            cliente: obraDB.cliente,
            activo: obraDB.activo                       
});

        res.json({
            ok: true,
            token: tokenObra
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

