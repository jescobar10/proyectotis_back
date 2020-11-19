"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const avanceobra_model_1 = require("../models/avanceobra.model");
const avanceObraRoutes = express_1.Router();
avanceObraRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    //avanceObraRoutes.post('/', [verificaToken], (req: any, res: Response) => {
    const body = req.body;
    body.obra = req.obra._id;
    avanceobra_model_1.AvanceObra.create(body).then(avanceObraDB => {
        res.json({
            ok: true
        });
    }).catch(err => {
        res.json(err);
    });
});
exports.default = avanceObraRoutes;
