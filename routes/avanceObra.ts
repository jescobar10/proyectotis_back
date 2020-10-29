import { Router, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';

const avanceObraRoutes = Router();

avanceObraRoutes.post('/', (req: any, res: Response) => {
    //avanceObraRoutes.post('/', [verificaToken], (req: any, res: Response) => {

    const body = req.body;

    //QUEDE AQUI

    res.json({
        ok: true
    });


});

export default avanceObraRoutes;