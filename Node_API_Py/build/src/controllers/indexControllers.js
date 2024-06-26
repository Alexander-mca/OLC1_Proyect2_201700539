"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexController = void 0;
var lexpython_1 = require("../Analizadores/lexpython");
var sintacticopy_1 = __importDefault(require("../Analizadores/sintacticopy"));
var funciones_1 = __importDefault(require("../Analizadores/funciones"));
var fs_1 = __importDefault(require("fs"));
var IndexController = /** @class */ (function () {
    function IndexController() {
    }
    IndexController.prototype.index = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ title: "Bienvenido" });
                return [2 /*return*/];
            });
        });
    };
    IndexController.prototype.Analisis = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var documento, resultado, aux, errores;
            return __generator(this, function (_a) {
                documento = req.body.Value.toString();
                console.log("*****************************************\n" + documento);
                console.log("si entra a Analisis en py");
                lexpython_1.scanner.ejecutar(documento);
                resultado = sintacticopy_1.default.ejecutar(lexpython_1.scanner);
                funciones_1.default.ReporteTokens(lexpython_1.scanner.tokens);
                funciones_1.default.ReporteErrores(resultado.Errores);
                aux = resultado.Traduccion;
                errores = funciones_1.default.getErrores(resultado.Errores);
                resultado.Traduccion = errores + aux;
                res.send(resultado.Traduccion);
                return [2 /*return*/];
            });
        });
    };
    IndexController.prototype.MostrarTokens = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tk;
            return __generator(this, function (_a) {
                if (fs_1.default.existsSync('tokens.html')) {
                    tk = fs_1.default.readFileSync('tokens.html', 'utf-8');
                    res.send(tk);
                }
                return [2 /*return*/];
            });
        });
    };
    IndexController.prototype.MostrarErrores = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_a) {
                if (fs_1.default.existsSync('errores.html')) {
                    err = fs_1.default.readFileSync('errores.html', 'utf-8');
                    res.send(err);
                }
                else {
                    res.json({ Info: "No hubieron errores" });
                }
                return [2 /*return*/];
            });
        });
    };
    return IndexController;
}());
exports.indexController = new IndexController();
