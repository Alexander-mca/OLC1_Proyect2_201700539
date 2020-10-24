"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexController = void 0;
var lexpython_1 = require("../Analizadores/lexpython");
var sintacticopy_1 = require("../Analizadores/sintacticopy");
var IndexController = /** @class */ (function () {
    function IndexController() {
    }
    IndexController.prototype.index = function (req, res) {
        res.json({ title: "Bienvenido" });
    };
    IndexController.prototype.Analisis = function (req, res) {
        var documento = req.body.Value.toString();
        //traduccion a python
        var scan = new lexpython_1.Scanner();
        scan.ejecutar(documento);
        var parse_ = new sintacticopy_1.Parser();
        parse_.ejecutar(scan);
        var resultadoPy = {
            Tokens: parse_.tokens,
            Errores: parse_.errores,
            Traduccion: parse_.traduccion
        };
        var respy = JSON.stringify(resultadoPy);
        res.json({ "Python": [respy] });
        console.log("Esta en indexController");
    };
    return IndexController;
}());
exports.indexController = new IndexController();
