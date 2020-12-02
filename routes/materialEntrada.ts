import { Router, Request, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { MaterialEntrada } from '../models/materialentrada.model';
import Token from '../classes/token';

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


export default materialEntradaRoutes;