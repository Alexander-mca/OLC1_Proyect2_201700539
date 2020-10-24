"use strict";
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
var Server = /** @class */ (function () {
    function Server() {
        this.app = express_1.default(); //express() devuelve un objeto
        this.config();
        this.routes();
    }
    Server.prototype.config = function () {
        this.app.use(body_parser_1.default.json());
        this.app.set('port', process.env.PORT || 3000); //el process es para que si ya existe un puerto definido se toma eso
        this.app.use(morgan_1.default('dev')); //el dev es para ver lo que estan pidiendo los clientes
        this.app.use(cors_1.default()); //pedir los datos del servidor
        this.app.use(body_parser_1.default.json()); //para que entienda el formato json y guarda en un req.body
        this.app.use(body_parser_1.default.urlencoded(({ extended: false }))); //por si para usar formato html        
    };
    Server.prototype.routes = function () {
        this.app.use('/', indexRoutes_1.default);
        //this.app.use('/', apiRoutes);
    };
    Server.prototype.start = function () {
        var _this = this;
        this.app.listen(this.app.get('port'), function () {
            console.log('Server on port ' + _this.app.get('port'));
        });
    };
    return Server;
}());
exports.server = new Server(); //ejecuta el constructor
exports.server.start();
