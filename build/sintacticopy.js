"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Parser = /** @class */ (function () {
    function Parser() {
        this.tokens = [];
        this.errores = [];
    }
    Parser.prototype.ejecutar = function (Scan) {
        this.tokens = Scan.tokens;
    };
    return Parser;
}());
exports.Parser = Parser;
