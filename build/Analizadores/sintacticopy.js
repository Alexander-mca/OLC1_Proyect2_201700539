"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Parser = /** @class */ (function () {
    function Parser() {
        this.i = 0;
        this.tokens = [];
        this.errores = [];
        this.preanalisis = null;
    }
    Parser.prototype.ejecutar = function (Scan) {
        this.tokens = Scan.tokens;
        this.errores = Scan.errores;
        this.preanalisis = this.tokens[this.i];
    };
    Parser.prototype.getNext = function () {
        if (this.i < this.tokens.length) {
            this.i++;
            return this.preanalisis = this.tokens[this.i];
        }
    };
    Parser.prototype.Match = function () {
    };
    Parser.prototype.Error = function () {
    };
    Parser.prototype.Panico = function () {
    };
    return Parser;
}());
exports.Parser = Parser;
