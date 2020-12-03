import { verificaToken } from '../middlewares/autenticacion';
import { TrabajadorObra } from '../models/trabajador_obra.model';
import Token from '../classes/token';
import { Trabajador } from '../models/trabajador.model';
import { Obra } from '../models/obra.model';
import trabajadorRoutes from './trabajador';
import{ Router, Request, Response} from 'express';

const trabajadorObraRoutes = Router();

trabajadorObraRoutes.get('/', async(req:Request,res:Response) => {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina-1;
    skip=skip*10;

    const body = req.body;

    const trabajadoresobras = await TrabajadorObra.find()
                                                  .sort({fecha:1})
                                                  .skip(skip)
                                                  .limit(10)
                                                  .exec();
                                                
    return res.json({
        ok:true,
        pagina,
        trabajadoresobras
    });
});

trabajadorObraRoutes.get('/:id', async(req:Request,res:Response) => {
    let id = req.params.id;
    await TrabajadorObra.findOne({id}, (err, TrabajadorObraDB) => {
        if(err)
            throw err;
        
        if(!TrabajadorObraDB){
            return res.json({
                ok:false,
                mensaje:`No existe una vinculacion entre trabajador y obra con id ${ id }`
            });
        }

        let trabajadorObra = {
            idTrabajador: TrabajadorObraDB.idTrabajador,
            idObra: TrabajadorObraDB.idObra,
            fecha: TrabajadorObraDB.fecha
        }

        return res.json({
            ok:true,
            trabajadorObra
        });
    });
})

trabajadorObraRoutes.post('/create', async(req:Request,res:Response) => {
    const vinculacion = {
        idTrabajador: req.body.idTrabajador,
        idObra: req.body.idObra,
        fecha: req.body.fecha
    }

    let trabajador = await Trabajador.findOne({_id:vinculacion.idTrabajador})
    .then(trabajadorDB => {
        console.log(trabajadorDB);
        return trabajadorDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    });

    if(!trabajador){
        return res.json({
            ok:false,
            mensaje:`Ha existido un problema con el trabajador con _id ${ vinculacion.idTrabajador }`
        });
    }

    console.log(trabajador);

    let obra = await Obra.findOne({_id:vinculacion.idObra})
    .then(obraDB => {
        console.log(obraDB);
        return obraDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    });

    if(!obra){
        return res.json({
            ok:false,
            mensaje: `Ha existido un problema con la obra con _id ${ vinculacion.idObra }`
        })
    }

    console.log(obra);

    TrabajadorObra.create(vinculacion)
    .then(vinculacionDB => {
        const tokenVinculacion = Token.getJwtToken({
            _id:vinculacionDB._id,
            idTrabajador:vinculacionDB.idTrabajador,
            idObra:vinculacionDB.idObra,
            fecha:vinculacionDB.fecha
        });

        return res.json({
            ok:true,
            token: tokenVinculacion,
            mensaje: `Se ha creado la vinculacion con exito, _id = ${ vinculacionDB._id }`
        })
    }).catch(err => {
        return res.json({
            ok:false,
            err
        })
    })
});

trabajadorObraRoutes.post('/update', async(req:Request,res:Response) => {
    let vinculacionDB = await TrabajadorObra.findOne({_id:req.body._id})
    .then(trabajadorObraDB => {
        console.log(trabajadorObraDB);
        return trabajadorObraDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    })

    if(!vinculacionDB){
        return res.json({
            ok:false,
            mensaje:`Ha existido un error con la vinculacion con _id ${ req.body._id }`
        });
    }

    let vinculacion = {
        _id: req.body._id || vinculacionDB._id,
        idTrabajador: req.body.idTrabajador || vinculacionDB.idTrabajador,
        idObra: req.body.idObra || vinculacionDB.idObra,
        fecha: req.body.fecha || vinculacionDB.fecha
    }

    let trabajador = await Trabajador.findOne({_id:vinculacion.idTrabajador})
    .then(trabajadorDB => {
        console.log(trabajadorDB);
        return trabajadorDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    });

    if(!trabajador){
        return res.json({
            ok:false,
            mensaje:`Ha existido un problema con el trabajador con _id ${ vinculacion.idTrabajador }`
        });
    }

    console.log(trabajador);

    let obra = await Obra.findOne({_id:vinculacion.idObra})
    .then(obraDB => {
        console.log(obraDB);
        return obraDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    });

    if(!obra){
        return res.json({
            ok:false,
            mensaje: `Ha existido un problema con la obra con _id ${ vinculacion.idObra }`
        })
    }

    console.log(obra);

    TrabajadorObra.updateOne({_id:vinculacion._id}, vinculacion, {new:true})
    .then(trabajadorObraDB => {
        const tokenVinculacion = Token.getJwtToken({
            _id:vinculacion._id,
            idTrabajador:vinculacion.idTrabajador,
            idObra:vinculacion.idObra,
            fecha:vinculacion.fecha
        });

        return res.json({
            ok:true,
            token: tokenVinculacion,
            mensaje: `Se ha actualizado la vinculacion con exito, _id = ${ vinculacion._id }`
        })
    }).catch(err => {
        return res.json({
            ok:false,
            err
        })
    })
});

export default trabajadorObraRoutes;