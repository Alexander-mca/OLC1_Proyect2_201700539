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
exports.server = void 0;
var express_1 = __importDefault(require("express")); //lo del los parentesis se define el tipo de dato
var morgan_1 = __importDefault(require("morgan")); //se pueden ver las peticiones que se hacen
var cors_1 = __importDefault(require("cors"));
var indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
var body_parser_1 = __importDefault(require("body-parser"));
var ip = process.env.NODEIPPY || "182.18.7.7";
var port = process.env.NODEPORTPY || 3000;
var Server = /** @class */ (function () {
    function Server() {
        this.app = express_1.default(); //express() devuelve un objeto
        this.config();
        this.routes();
    }
    Server.prototype.config = function () {
        this.app.set('port', port); //el process es para que si ya existe un puerto definido se toma eso
        this.app.set('ip', ip);
        this.app.use(express_1.default.json());
        this.app.use(morgan_1.default('dev')); //el dev es para ver lo que estan pidiendo los clientes
        this.app.use(cors_1.default()); //pedir los datos del servidor
        this.app.use(body_parser_1.default.json()); //para que entienda el formato json y guarda en un req.body
        this.app.use(body_parser_1.default.urlencoded(({ extended: false }))); //por si para usar formato html        
    };
    Server.prototype.routes = function () {
        this.app.use('/', indexRoutes_1.default);
    };
    Server.prototype.start = function () {
        var _this = this;
        this.app.listen(this.app.get('port'), function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('IP: %s PORT: %d', ip, port);
                return [2 /*return*/];
            });
        }); });
    };
    return Server;
}());
exports.server = new Server(); //ejecuta el constructor
exports.server.start();
