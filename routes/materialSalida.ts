import { Router, Request, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { MaterialSalida } from '../models/materialsalida.model';
import Token from '../classes/token';
import { Material } from '../models/material.model';
import { Obra } from '../models/obra.model';
import bodyParser from 'body-parser';

const materialSalidaRoutes = Router();

materialSalidaRoutes.get('/', async ( req: Request, res: Response ) =>{
    
    
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina-1;
    skip = skip*10;

    const body = req.body;

    const entradas = await MaterialSalida.find()
                                          .sort( {Fecha:1} )
                                          .skip(skip)
                                          .limit(10)
                                          .exec();
    
    res.json({
        ok: true,
        pagina,
        entradas
    });
});

materialSalidaRoutes.get('/:id', async(req:Request,res:Response) => {
    let id = req.params.id;
    await MaterialSalida.findOne({id}, (err,salidaDB) => {
        if (err)
            throw err;

        if(!salidaDB){
            return res.json({
                ok: false,
                mensaje: `No existe una salida registrada con el _id ${ id }`
            });
        }

        let salida = {
            idMaterial: salidaDB.idMaterial,
            idObra: salidaDB.idObra,
            fecha: salidaDB.fecha,
            cantidad: salidaDB.cantidad
        }

        return res.json({
            ok: true,
            salida
        })
    });
});

materialSalidaRoutes.post('/create', async(req:Request,res:Response) => {
    const salida = {
        idMaterial: req.body.idMaterial,
        idObra: req.body.idObra,
        fecha: req.body.fecha,
        cantidad: req.body.cantidad
    }

    let obra = await Obra.findOne({_id:salida.idObra})
    .then(obraBD => {
        console.log(obraBD);
        return obraBD;
    })
    .catch(err => {
        console.log(err);
        return undefined;
    })

    if(!obra){
        return res.json({
            ok:false,
            mensaje:`Se ha encontrado un error con la obra con id ${ salida.idObra }`
        });
    }

    console.log(obra);

    let material = await Material.findOne({_id:salida.idMaterial})
    .then(materialDB => {
        console.log(materialDB);
        return materialDB;
    })
    .catch(err => {
        console.log(err);
        return undefined;
    })

    if(!material){
        return res.json({
            ok:false,
            mensaje:`Se ha encontrado un error con el material con id ${ salida.idMaterial }`
        });
    }

    console.log(material);

    let nueva_cantidad = Number(material.cantidad) - Number(salida.cantidad);
    
    if(nueva_cantidad < 0){
        return res.json({
            ok:false,
            mensaje:`No hay suficiente material para retirar, si se retira esa cantidad la nueva cantidad seria ${ nueva_cantidad }`
        })
    }
    
    material.cantidad = nueva_cantidad;

    Material.updateOne({_id:material._id},material,{ new: true }, ( err, materialUpdated) => {
        if(err)
            throw err;
    });

    MaterialSalida.create(salida).then(salidaDB => {
        const tokenEntrada = Token.getJwtToken({
            _id:salidaDB._id,
            idMaterial:salidaDB.idMaterial,
            idObra:salidaDB.idObra,
            fecha:salidaDB.fecha,
            cantidad:salidaDB.cantidad
        });

        return res.json({
            ok:true,
            token: tokenEntrada,
            mensaje:'Se ha creado la salida del material con exito'
        })

    }).catch(err => {
        res.json({
            ok:false,
            err
        })
    });
});

materialSalidaRoutes.post('/update', async(req: any, res: Response) => {
    let salidaBD = await MaterialSalida.findOne({_id:req.body._id})
    .then(departureDB => {
        console.log(departureDB);
        return departureDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    });

    if(!salidaBD){
        return res.json({
            ok:false,
            mensaje: `No se encuentra una salida con _id ${ req.body._id }`
        })
    }

    let salida = {
        _id: req.body._id || salidaBD._id,
        idMaterial: req.body.idMaterial || salidaBD.idMaterial,
        idObra: req.body.idProveedor || salidaBD.idObra,
        fecha: req.body.fecha || salidaBD.fecha,
        cantidad: req.body.cantidad || salidaBD.cantidad
    }

    let obra = await Obra.findOne({_id:salida.idObra})
    .then(obraBD => {
        console.log(obraBD);
        return obraBD;
    })
    .catch(err => {
        console.log(err);
        return undefined;
    })

    if(!obra){
        return res.json({
            ok:false,
            mensaje:`Se ha encontrado un error con la obra con id ${ salida.idObra }`
        });
    }

    console.log(obra);

    let material = await Material.findOne({_id:salida.idMaterial})
    .then(materialDB => {
        console.log(materialDB);
        return materialDB;
    })
    .catch(err => {
        console.log(err);
        return undefined;
    })

    if(!material){
        return res.json({
            ok:false,
            mensaje:`Se ha encontrado un error con el material con id ${ salida.idMaterial }`
        });
    }

    console.log(material);

    if(salida.cantidad < 0){
        return res.json({
            ok:false,
            mensaje: `La cantidad no debe ser negativa`
        })
    }

    if(salida.cantidad != undefined && Number(salida.cantidad) != Number(salida.cantidad)){
        let nueva_cantidad = Number(material.cantidad) - (Number(salida.cantidad) - Number(salidaBD.cantidad));
        if(nueva_cantidad < 0){
            return res.json({
                ok:false,
                mensaje: `No se puede actualizar la cantidad porque la nueva cantidad seria ${ nueva_cantidad }`
            })
        }
        material.cantidad = nueva_cantidad;
        Material.updateOne({_id:material._id},material,{ new: true }, ( err, materialUpdated) => {
            if(err)
                throw err;
        });    
    }

    MaterialSalida.updateOne( {_id:salida._id}, salida, { new: true }, ( err, salidadUpdated) => {
        
        if( err ) throw err;

        const tokenSalida = Token.getJwtToken({
                    _id:salida._id,
                    idMaterial:salida.idMaterial,
                    idObra:salida.idObra,
                    fecha:salida.fecha,
                    cantidad:salida.cantidad
        });

        res.json({
            ok: true,
            mensaje: `Se ha actualizado la salida con id ${salida._id}`,
            token: tokenSalida
        });

    });

});


export default materialSalidaRoutes;