import { Router, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { AvanceObra } from '../models/avanceobra.model';

const avanceObraRoutes = Router();

avanceObraRoutes.post('/', (req: any, res: Response) => {
    //avanceObraRoutes.post('/', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    //body.obra = req.obra._id;

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

export default avanceObraRoutes;