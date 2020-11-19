import { Router, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { AvanceObra } from '../models/avanceobra.model';

const avanceObraRoutes = Router();

avanceObraRoutes.post('/', [ verificaToken], (req: any, res: Response) => {
    //avanceObraRoutes.post('/', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    body.obra = req.obra._id;

    AvanceObra.create( body ).then( avanceObraDB =>{


        res.json({
            ok: true
        });

    }).catch( err => {
        res.json( err )
    });


});

export default avanceObraRoutes;