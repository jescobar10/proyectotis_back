"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../classes/token"));
exports.verificaToken = (req, res, next) => {
    //X-token en el Header
    const userToken = req.get('Authorization') || '';
    console.log('Este es el tocken: ' + userToken);
    token_1.default.comprobarToken(userToken)
        .then((decoded) => {
        console.log('Decoded', decoded);
        req.usuario = decoded.usuario;
        next();
    })
        .catch(err => {
        res.json({
            ok: false,
            mensaje: 'Token no es correcto'
        });
    });
};
