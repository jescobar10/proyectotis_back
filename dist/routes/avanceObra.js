"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const avanceObraRoutes = express_1.Router();
avanceObraRoutes.post('/', (req, res) => {
    //avanceObraRoutes.post('/', [verificaToken], (req: any, res: Response) => {
    const body = req.body;
    //QUEDE AQUI
    res.json({
        ok: true
    });
});
exports.default = avanceObraRoutes;
