import { Router, Request, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { AvanceObra } from '../models/avanceobra.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';

const avanceObraRoutes = Router();
//Se define el filesystem que va a permitir subor los archivos img / pdf
const fileSystem = new FileSystem();

//Obtener avance Obra Paginados
avanceObraRoutes.get('/', async (req: any, res: Response) => {

    //Paginación
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

   const avanceObras = await AvanceObra.find()
                                       .sort({ _id: -1 })
                                       .skip( skip )
                                       .limit(10)
                                       .populate('usuario', '-password')
                                       .exec();

    res.json({
        ok:true,
        pagina,
        avanceObras
    });

});



//Crear Avance Obra
avanceObraRoutes.post('/', [verificaToken], (req: any, res: Response) => {
    //avanceObraRoutes.post('/', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    //body.obra = req.obra._id;
    body.usuario = req.usuario._id;

    //Para subir varios archivos 
    const imagenes =  fileSystem.imagenesDeTempHaciaModulo( req.usuario._id, "avanceObra" );

    //se pasa la imagen al cuerpo del avance de la obra
    body.foto = imagenes;

    AvanceObra.create( body ).then( async avanceObraDB =>{

        //Parte que envia todo el objeto usaurio no solo el Id
       await avanceObraDB.populate('usuario', '-password').execPopulate();
       // await avanceObraDB.populate('obra').execPopulate();

        res.json({
            ok: true,
            avanceObra:avanceObraDB
        });

    }).catch( err => {
        res.json( err )
    });

});


///Se definen las rutas o servicios para subir archivos (Imagenes / pdf)
avanceObraRoutes.post('/uploadimg', [ verificaToken ], async (req: any, res: Response) =>  {
   
    console.log('Back Archivos Subidos : ' + req.files );
    console.log('Back Archivos Subidos : ' + req.files.image );
    console.log('Back Archivos Req : ' + req.image );
    
    //Se valida si viene algun archivo 
    if( !req.files ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }

    //Se sube el archivo
    const file: FileUpload = req.files.image;

    if( !file ) {
        return res.status(400).json({
            mensaje: 'No se subio ningun archivo'
        });
    }

    //si no es ni imagen 
    if( !file.mimetype.includes('image')){
        //if( !file.mimetype.includes('image') || !file.mimetype.includes('pdf')){
        return res.status(400).json({
            mensaje: 'Lo que subio no es una imagen'
        });
    }


   await fileSystem.guardarImagenTemporal( file, req.usuario._id );
   
    res.json({
        ok: true,
        file: file.mimetype
    });

});

avanceObraRoutes.get('/imagen/:avanceObraid/:img', (req: any, res: Response ) => {

    const avanceObraid = req.params.avanceObraid;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoUrl( avanceObraid, img, "avanceObra" );

    res.sendFile( pathFoto );

});

// PDF
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------

///Se definen las rutas o servicios para subir archivos (pdf)
avanceObraRoutes.post('/uploadpdf', [ verificaToken ], async (req: any, res: Response) =>  {
   
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
        //if( !file.mimetype.includes('image') || !file.mimetype.includes('pdf')){
        return res.status(400).json({
            mensaje: 'Lo que subio no es una imagen'
        });
    }


   await fileSystem.guardarImagenTemporal( file, req.usuario._id );
   
    res.json({
        ok: true,
        file: file.mimetype
    });

});

avanceObraRoutes.get('/imagen/:avanceObraid/:pdf', (req: any, res: Response ) => {

    const avanceObraid = req.params.avanceObraid;
    const img = req.params.pdf;

    const pathFoto = fileSystem.getFotoUrl( avanceObraid, img, "avanceObra" );

    res.sendFile( pathFoto );

});



export default avanceObraRoutes;