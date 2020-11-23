"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const avanceobra_model_1 = require("../models/avanceobra.model");
const avanceObraRoutes = express_1.Router();
avanceObraRoutes.post('/', (req, res) => {
    //avanceObraRoutes.post('/', [verificaToken], (req: any, res: Response) => {
    const body = req.body;
    //body.obra = req.obra._id;
    avanceobra_model_1.AvanceObra.create(body).then((avanceObraDB) => __awaiter(this, void 0, void 0, function* () {
        //Parte que envia todo el objeto usaurio no solo el Id
        yield avanceObraDB.populate('usuario', '-password').execPopulate();
        // await avanceObraDB.populate('obra').execPopulate();
        res.json({
            ok: true,
            avanceObra: avanceObraDB
        });
    })).catch(err => {
        res.json(err);
    });
});
exports.default = avanceObraRoutes;
