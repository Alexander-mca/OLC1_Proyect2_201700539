"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var indexControllers_1 = require("../controllers/indexControllers");
var IndexRoutes = /** @class */ (function () {
    function IndexRoutes() {
        this.router = express_1.Router();
        this.config();
    }
    IndexRoutes.prototype.config = function () {
        this.router.get('/', indexControllers_1.indexController.index);
        this.router.post('/Data', indexControllers_1.indexController.Analisis);
    };
    return IndexRoutes;
}());
var indexRoutes = new IndexRoutes();
exports.default = indexRoutes.router;
