import { Response, Request, NextFunction } from 'express';
import Token  from '../classes/token';


export const verificaToken = ( req: any, res: Response, next: NextFunction ) => {

    //X-token en el Header
    const userToken = req.get('Authorization') || '';

    console.log(userToken);

    Token.comprobarToken( userToken )
    .then( (decoded: any) => {
            console.log('Decoded', decoded);
            req.usuario = decoded.usuario;
            next();
    })
    .catch( err => {

        res.json({
            ok: false,
            mensaje: 'Token no es correcto'
        });
        
    })
}