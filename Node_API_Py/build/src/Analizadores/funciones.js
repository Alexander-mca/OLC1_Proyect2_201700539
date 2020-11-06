"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var lexpython_1 = require("./lexpython");
var Funcion = /** @class */ (function () {
    function Funcion() {
    }
    Funcion.prototype.getErrores = function (errores) {
        var contenido = "";
        errores.forEach(function (err) {
            contenido += "\nTipo Error:" + lexpython_1.TipoErr[err.tipo] + ", Descripcion:\"" + err.descripcion + "\", Linea:" + err.fila + ", Columna:" + err.columna;
        });
        return contenido + "\n";
    };
    Funcion.prototype.ReporteErrores = function (errores) {
        var cont = 0;
        var contenido = "<html>\n<head>\n<title>Errores</title>\n</head>" +
            "\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css\" integrity=\"sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2\" crossorigin=\"anonymous\">\n<body>";
        contenido += "\n<table class=\"table table-hover\"style=\"max-width:60%;margin-left:20%;\">\n<thead>\n";
        contenido += "<tr>\n<th scope=\"col\">No.</th>" +
            "\n<th scope=\"col\">Tipo</th>\n<th scope=\"col\">Descripcion</th>" +
            "\n<th scope=\"col\">Linea</th>\n<th scope=\"col\">Columna</th>\n</tr>\n</thead>";
        contenido += "\n<tbody>";
        errores.forEach(function (err) {
            contenido += "\n<tr class=\"table-warning\">\n<td scope=\"row\">" + cont + "</td>" +
                "\n<td>" + lexpython_1.TipoErr[err.tipo] + "</td>" + "\n<td>" + err.descripcion + "</td>" +
                "\n<td>" + err.fila + "</td>" + "\n<td>" + err.columna + "</td>\n</tr>";
            cont++;
        });
        contenido += "\n<script src=\"https://code.jquery.com/jquery-3.5.1.slim.min.js\" integrity=\"sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj\" crossorigin=\"anonymous\"></script>" +
            "\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx\" crossorigin=\"anonymous\"></script>";
        contenido += "\n</tbody>\n</table>\n</body>\n</html>";
        fs_1.default.writeFile('errores.html', contenido, function (error) {
            if (error)
                console.log(error);
            else
                console.log('El archivo fue creado');
        });
        //window.open('http://localhost:3080/errores.html');
    };
    Funcion.prototype.ReporteTokens = function (tokens) {
        if (tokens.length > 0) {
            var cont = 1;
            var contenido = "<html>\n<head>\n<title>Tokens</title>\n</head>" +
                "\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css\" integrity=\"sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2\" crossorigin=\"anonymous\">\n<body>";
            contenido += "\n<table class=\"table table-hover\"style=\"max-width:60%;margin-left:20%;\">\n<thead>\n";
            contenido += "<tr>\n<th scope=\"col\">No.</th>" +
                "\n<th scope=\"col\">Tipo</th>\n<th scope=\"col\">Lexema</th>" +
                "\n<th scope=\"col\">Linea</th>\n<th scope=\"col\">Columna</th>\n</tr>\n</thead>";
            contenido += "\n<tbody>";
            tokens.forEach(function (tk) {
                contenido += "\n<tr class=\"table-info\">\n<td scope=\"row\">" + String(cont) + "</td>" +
                    "\n<td>" + String(tk.tipo) + "</td>" + "\n<td>" + tk.lexema + "</td>" +
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
            //window.open('http://localhost:3000/tokens.html');
        }
    };
    return Funcion;
}());
var funciones = new Funcion();
exports.default = funciones;
