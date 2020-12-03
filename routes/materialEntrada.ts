import { Router, Request, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { MaterialEntrada } from '../models/materialentrada.model';
import Token from '../classes/token';
import { Material } from '../models/material.model';
import { Proveedor } from '../models/proveedor.model';
import bodyParser from 'body-parser';

const materialEntradaRoutes = Router();

materialEntradaRoutes.get('/', async ( req: Request, res: Response ) =>{
    
    
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina-1;
    skip = skip*10;

    const body = req.body;

    const entradas = await MaterialEntrada.find()
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

materialEntradaRoutes.get('/:id', async(req:Request,res:Response) => {
    let id = req.params.id;
    await MaterialEntrada.findOne({id}, (err,entradaDB) => {
        if (err)
            throw err;

        if(!entradaDB){
            return res.json({
                ok: false,
                mensaje: `No existe una entrada registrada con el id ${ id }`
            });
        }

        let entrada = {
            idMaterial: entradaDB.idMaterial,
            idProveedor: entradaDB.idProveedor,
            fecha: entradaDB.fecha,
            cantidad: entradaDB.cantidad
        }

        return res.json({
            ok: true,
            entrada
        })
    });
});

materialEntradaRoutes.post('/create', async(req:Request,res:Response) => {
    const entrada = {
        idMaterial: req.body.idMaterial,
        idProveedor: req.body.idProveedor,
        fecha: req.body.fecha,
        cantidad: req.body.cantidad
    }

    let proveedor = await Proveedor.findOne({_id:entrada.idProveedor})
    .then(proveedorDB => {
        console.log(proveedorDB);
        return proveedorDB;
    })
    .catch(err => {
        console.log(err);
        return undefined;
    })

    if(!proveedor){
        return res.json({
            ok:false,
            mensaje:`Se ha encontrado un error con el proveedor con id ${ entrada.idProveedor }`
        });
    }

    console.log(proveedor);

    let material = await Material.findOne({_id:entrada.idMaterial})
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
            mensaje:`Se ha encontrado un error con el material con id ${ entrada.idMaterial }`
        });
    }

    console.log(material);

    let nueva_cantidad = Number(material.cantidad) + Number(entrada.cantidad);
    material.cantidad = nueva_cantidad;

    Material.updateOne({_id:material._id},material,{ new: true }, ( err, materialUpdated) => {
        if(err)
            throw err;
    });

    MaterialEntrada.create(entrada).then(entradaDB => {
        const tokenEntrada = Token.getJwtToken({
            _id:entradaDB._id,
            idMaterial:entradaDB.idMaterial,
            idProveedor:entradaDB.idProveedor,
            fecha:entradaDB.fecha,
            cantidad:entradaDB.cantidad
        });

        return res.json({
            ok:true,
            token: tokenEntrada,
            mensaje:'Se ha creado la entrada al material con exito'
        })

    }).catch(err => {
        res.json({
            ok:false,
            err
        })
    });
});

materialEntradaRoutes.post('/update', async(req: any, res: Response) => {
    let entradaBD = await MaterialEntrada.findOne({_id:req.body._id})
    .then(entryDB => {
        console.log(entryDB);
        return entryDB;
    }).catch(err => {
        console.log(err);
        return undefined;
    });

    if(!entradaBD){
        return res.json({
            ok:false,
            mensaje: `No se encuentra una entrada con _id ${ req.body._id }`
        })
    }

    let entrada = {
        _id: req.body._id || entradaBD._id,
        idMaterial: req.body.idMaterial || entradaBD.idMaterial,
        idProveedor: req.body.idProveedor || entradaBD.idProveedor,
        fecha: req.body.fecha || entradaBD.fecha,
        cantidad: req.body.cantidad || entradaBD.cantidad
    }

    let proveedor = await Proveedor.findOne({_id:entrada.idProveedor})
    .then(proveedorDB => {
        console.log(proveedorDB);
        return proveedorDB;
    })
    .catch(err => {
        console.log(err);
        return undefined;
    })

    if(!proveedor){
        return res.json({
            ok:false,
            mensaje:`Se ha encontrado un error con el proveedor con id ${ entrada.idProveedor }`
        });
    }

    console.log(proveedor);

    let material = await Material.findOne({_id:entrada.idMaterial})
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
            mensaje:`Se ha encontrado un error con el material con id ${ entrada.idMaterial }`
        });
    }

    console.log(material);

    if(entrada.cantidad < 0){
        return res.json({
            ok:false,
            mensaje: `La cantidad no debe ser negativa`
        })
    }

    if(entrada.cantidad != undefined && Number(entrada.cantidad) != Number(entradaBD.cantidad)){
        let nueva_cantidad = Number(material.cantidad) + (Number(entrada.cantidad) - Number(entradaBD.cantidad));
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

    MaterialEntrada.updateOne( {_id:entrada._id}, entrada, { new: true }, ( err, entradaUpdated) => {
        
        if( err ) throw err;

        const tokenEntrada = Token.getJwtToken({
                    _id:entrada._id,
                    idMaterial:entrada.idMaterial,
                    idProveedor:entrada.idProveedor,
                    fecha:entrada.fecha,
                    cantidad:entrada.cantidad
        });

        res.json({
            ok: true,
            mensaje: `Se ha actualizado la entrada con id ${entrada._id}`,
            token: tokenEntrada
        });

    });

});


export default materialEntradaRoutes;