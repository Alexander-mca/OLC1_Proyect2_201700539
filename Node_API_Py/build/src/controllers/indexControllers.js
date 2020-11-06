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
            var documento, resultado;
            return __generator(this, function (_a) {
                documento = req.body.Value.toString();
                console.log("*****************************************\n" + documento);
                console.log("si entra a Analisis en py");
                lexpython_1.scanner.ejecutar(documento);
                resultado = sintacticopy_1.default.ejecutar(lexpython_1.scanner);
                //this.ReporteTokens(scanner.tokens);
                console.log(resultado.Traduccion);
                res.send(resultado.Traduccion);
                return [2 /*return*/];
            });
        });
    };
    IndexController.prototype.ReporteTokens = function (tokens) {
        var cont = 0;
        var contenido = "<html>\n<head>\n<title>Errores</title>\n</head>" +
            "\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css\" integrity=\"sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2\" crossorigin=\"anonymous\">\n<body>";
        contenido += "\n<table class=\"table table-hover\">\n<thead>\n";
        contenido += "<tr>\n<th scope=\"col\">No.</th>" +
            "\n<th scope=\"col\">Tipo</th>\n<th scope=\"col\">Lexema</th>" +
            "\n<th scope=\"col\">Linea</th>\n<th scope=\"col\">Columna</th>\n</tr>\n</thead>";
        contenido += "\n<tbody>";
        tokens.forEach(function (tk) {
            contenido += "\n<tr class=\"table-info\">\n<td scope=\"row\">" + String(cont) + "</td>" +
                "\n<td>" + String(tk.tipo) + "</td>" + "\n<td>" + tk.lexema + "</td>";
            "\n<td>" + String(tk.fila) + "</td>" + "\n<td>" + String(tk.columna) + "</td>\n</tr>";
            cont++;
        });
        contenido += "\n<script src=\"https://code.jquery.com/jquery-3.5.1.slim.min.js\" integrity=\"sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj\" crossorigin=\"anonymous\"></script>" +
            "\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx\" crossorigin=\"anonymous\"></script>";
        contenido += "\n</tbody>\n</table>\n</body>\n</html>";
        fs_1.default.writeFile('./tokens.html', contenido, function (error) {
            if (error)
                console.log(error);
            else
                console.log('El archivo fue creado');
        });
        window.open('./tokens.html');
    };
    return IndexController;
}());
exports.indexController = new IndexController();
