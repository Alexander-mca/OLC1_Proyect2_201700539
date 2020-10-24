"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.Error = exports.TipoErr = exports.Tipo = exports.Scanner = void 0;
var Token = /** @class */ (function () {
    function Token(lexema, tipo, fila, columna) {
        this.lexema = lexema;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
    }
    return Token;
}());
exports.Token = Token;
var Error = /** @class */ (function () {
    function Error(tipo, fila, columna, descripcion) {
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
        this.descripcion = descripcion;
    }
    return Error;
}());
exports.Error = Error;
var TipoErr;
(function (TipoErr) {
    TipoErr[TipoErr["lexico"] = 0] = "lexico";
    TipoErr[TipoErr["sintactico"] = 1] = "sintactico";
})(TipoErr || (TipoErr = {}));
exports.TipoErr = TipoErr;
var Tipo;
(function (Tipo) {
    Tipo[Tipo["id"] = 1] = "id";
    Tipo[Tipo["entero"] = 2] = "entero";
    Tipo[Tipo["double"] = 3] = "double";
    Tipo[Tipo["cadena"] = 4] = "cadena";
    Tipo[Tipo["caracter"] = 5] = "caracter";
    Tipo[Tipo["comentarioSimple"] = 6] = "comentarioSimple";
    Tipo[Tipo["comentarioMulti"] = 7] = "comentarioMulti";
    Tipo[Tipo["or"] = 8] = "or";
    Tipo[Tipo["and"] = 9] = "and";
    Tipo[Tipo["xor"] = 10] = "xor";
    Tipo[Tipo["not"] = 11] = "not";
    Tipo[Tipo["mas"] = 12] = "mas";
    Tipo[Tipo["masmas"] = 13] = "masmas";
    Tipo[Tipo["menosmenos"] = 14] = "menosmenos";
    Tipo[Tipo["division"] = 15] = "division";
    Tipo[Tipo["por"] = 16] = "por";
    Tipo[Tipo["menos"] = 17] = "menos";
    Tipo[Tipo["mayor"] = 18] = "mayor";
    Tipo[Tipo["menor"] = 19] = "menor";
    Tipo[Tipo["igual"] = 20] = "igual";
    Tipo[Tipo["diferente"] = 21] = "diferente";
    Tipo[Tipo["punto"] = 22] = "punto";
    Tipo[Tipo["puntoycoma"] = 23] = "puntoycoma";
    Tipo[Tipo["coma"] = 24] = "coma";
    Tipo[Tipo["parizq"] = 25] = "parizq";
    Tipo[Tipo["parder"] = 26] = "parder";
    Tipo[Tipo["corizq"] = 27] = "corizq";
    Tipo[Tipo["corder"] = 28] = "corder";
    Tipo[Tipo["llaveizq"] = 29] = "llaveizq";
    Tipo[Tipo["llaveder"] = 30] = "llaveder";
    Tipo[Tipo["rclass"] = 31] = "rclass";
    Tipo[Tipo["rvoid"] = 32] = "rvoid";
    Tipo[Tipo["rif"] = 33] = "rif";
    Tipo[Tipo["rwhile"] = 34] = "rwhile";
    Tipo[Tipo["rdo"] = 35] = "rdo";
    Tipo[Tipo["relse"] = 36] = "relse";
    Tipo[Tipo["rsystem"] = 37] = "rsystem";
    Tipo[Tipo["rout"] = 38] = "rout";
    Tipo[Tipo["rprint"] = 39] = "rprint";
    Tipo[Tipo["rprintln"] = 40] = "rprintln";
    Tipo[Tipo["rtrue"] = 41] = "rtrue";
    Tipo[Tipo["rfalse"] = 42] = "rfalse";
    Tipo[Tipo["rfor"] = 43] = "rfor";
    Tipo[Tipo["rpublic"] = 44] = "rpublic";
    Tipo[Tipo["args"] = 45] = "args";
    Tipo[Tipo["rprivate"] = 46] = "rprivate";
    Tipo[Tipo["rprotected"] = 47] = "rprotected";
    Tipo[Tipo["rint"] = 48] = "rint";
    Tipo[Tipo["rchar"] = 49] = "rchar";
    Tipo[Tipo["rstring"] = 50] = "rstring";
    Tipo[Tipo["rdouble"] = 51] = "rdouble";
    Tipo[Tipo["rboolean"] = 52] = "rboolean";
    Tipo[Tipo["rbreak"] = 53] = "rbreak";
    Tipo[Tipo["rreturn"] = 54] = "rreturn";
    Tipo[Tipo["rcontinue"] = 55] = "rcontinue";
    Tipo[Tipo["rstatic"] = 56] = "rstatic";
    Tipo[Tipo["rmain"] = 57] = "rmain";
    Tipo[Tipo["rinterface"] = 58] = "rinterface";
    Tipo[Tipo["dolar"] = 59] = "dolar";
})(Tipo || (Tipo = {}));
exports.Tipo = Tipo;
var Scanner = /** @class */ (function () {
    function Scanner() {
        this.errores = [];
        this.tokens = [];
        this.depurado = "";
    }
    Scanner.prototype.ejecutar = function (doc) {
        var estado = 0;
        var lexema = "";
        var fila = 1, columna = 1;
        this.depurado = "";
        for (var i = 0; i < doc.length; i++) {
            var c = doc[i];
            switch (estado) {
                case 0:
                    if ((/[a-zA-Z]/).test(c)) {
                        estado = 1;
                        lexema += c;
                    }
                    else if ((/[0-9]/).test(c)) {
                        estado = 2;
                        lexema += c;
                    }
                    else if (c == ' ' || c == '\r' || c == '\b' || c == '\t') {
                    }
                    else if (c == '\n') {
                        fila++;
                        columna = 1;
                    }
                    else {
                        switch (c) {
                            case '"':
                                lexema += c;
                                estado = 11;
                                break;
                            case '/':
                                lexema += c;
                                estado = 5;
                                break;
                            case '-':
                                lexema += c;
                                estado = 15;
                                break;
                            case '+':
                                lexema += c;
                                estado = 13;
                                break;
                            case '&':
                                lexema += c;
                                this.tokens.push(new Token(lexema, Tipo.and, fila, columna));
                                lexema = "";
                                break;
                            case '|':
                                lexema += c;
                                this.tokens.push(new Token(lexema, Tipo.or, fila, columna));
                                lexema = "";
                                break;
                            case '^':
                                lexema += c;
                                this.tokens.push(new Token(lexema, Tipo.xor, fila, columna));
                                lexema = "";
                                break;
                            case '=':
                                lexema += c;
                                this.tokens.push(new Token(lexema, Tipo.igual, fila, columna));
                                lexema = "";
                                break;
                            case '<':
                                lexema += c;
                                this.tokens.push(new Token(lexema, Tipo.menor, fila, columna));
                                lexema = "";
                                break;
                            case '>':
                                lexema += c;
                                this.tokens.push(new Token(lexema, Tipo.mayor, fila, columna));
                                lexema = "";
                                break;
                            case '!':
                                lexema += c;
                                estado = 7;
                                break;
                            case ';':
                                lexema += c;
                                this.tokens.push(new Token(lexema, Tipo.puntoycoma, fila, columna));
                                lexema = "";
                                break;
                            case '.':
                                lexema += c;
                                this.tokens.push(new Token(lexema, Tipo.punto, fila, columna));
                                lexema = "";
                                break;
                            case '(':
                                lexema += c;
                                this.tokens.push(new Token(lexema, Tipo.parizq, fila, columna));
                                lexema = "";
                                break;
                            case ')':
                                lexema += c;
                                this.tokens.push(new Token(lexema, Tipo.parder, fila, columna));
                                lexema = "";
                                break;
                            case '{':
                                lexema += c;
                                this.tokens.push(new Token(lexema, Tipo.llaveizq, fila, columna));
                                lexema = "";
                                break;
                            case '}':
                                lexema += c;
                                this.tokens.push(new Token(lexema, Tipo.llaveder, fila, columna));
                                lexema = "";
                                break;
                            case '[':
                                lexema += c;
                                this.tokens.push(new Token(lexema, Tipo.corizq, fila, columna));
                                lexema = "";
                                break;
                            case ']':
                                lexema += c;
                                this.tokens.push(new Token(lexema, Tipo.corder, fila, columna));
                                lexema = "";
                                break;
                            case ',':
                                lexema += c;
                                this.tokens.push(new Token(lexema, Tipo.coma, fila, columna));
                                lexema = "";
                                break;
                            case '\'':
                                lexema += c;
                                estado = 17;
                                break;
                            default:
                                this.errores.push(new Error(TipoErr.lexico, fila, columna, "El caracter '" + c + "' no pertenece al lenguaje"));
                                estado = 0;
                                lexema = "";
                                continue;
                        }
                    }
                    break;
                case 1: //se aceptan los ids
                    if (!(/[0-9]/).test(c) || !(/[a-zA-Z]/).test(c) || c != '_') {
                        this.tokens.push(new Token(lexema, this.reservadas(lexema), fila, columna));
                        lexema = "";
                        estado = 0;
                        i--;
                    }
                    lexema += c;
                    break;
                case 2:
                    if ((/[0-9]/).test(c)) {
                        lexema += c;
                    }
                    else if (c == '.') {
                        lexema += c;
                        estado = 3;
                    }
                    else {
                        this.tokens.push(new Token(lexema, Tipo.entero, fila, columna));
                        lexema = "";
                        estado = 0;
                        i--;
                    }
                    break;
                case 3:
                    if ((/[0-9]/).test(c)) {
                        lexema += c;
                        estado = 4;
                    }
                    break;
                case 4:
                    if (!(/[0-9]/).test(c)) {
                        this.tokens.push(new Token(lexema, Tipo.double, fila, columna));
                        lexema = "";
                        estado = 0;
                        i--;
                    }
                    lexema += c;
                    break;
                case 5:
                    if (c == '*') {
                        lexema += c;
                        estado = 8;
                    }
                    else if (c == '/') {
                        lexema += c;
                        estado = 6;
                    }
                    else {
                        //se acepta el simbolo de division
                        this.tokens.push(new Token(lexema, Tipo.division, fila, columna));
                        lexema = "";
                        estado = 0;
                        i--;
                    }
                    break;
                case 6:
                    if (c != '\n') {
                        lexema += c;
                        fila++;
                        columna = 1;
                        continue;
                    }
                    this.tokens.push(new Token(lexema, Tipo.comentarioSimple, fila, columna));
                    lexema = "";
                    estado = 0;
                    break;
                case 7:
                    if (c == '=') {
                        lexema += c;
                        this.tokens.push(new Token(lexema, Tipo.diferente, fila, columna));
                        lexema = "";
                        estado = 0;
                        continue;
                    }
                    this.tokens.push(new Token(lexema, Tipo.not, fila, columna));
                    lexema = "";
                    estado = 0;
                    i--;
                    break;
                case 8:
                    lexema += c;
                    if (c == '*') {
                        estado = 9;
                    }
                    else if (c == '\n') {
                        fila++;
                        columna = 1;
                    }
                    break;
                case 9:
                    lexema += c;
                    if (c == '/') { //se acepta el comentario multilinea
                        this.tokens.push(new Token(lexema, Tipo.comentarioMulti, fila, columna));
                        lexema = "";
                        estado = 0;
                        continue;
                    }
                    else if (c == '\n') {
                        fila++;
                        columna = 1;
                    }
                    estado = 8;
                    break;
                case 11:
                    lexema += c;
                    if (c == '"') {
                        this.tokens.push(new Token(lexema, Tipo.cadena, fila, columna));
                        lexema = "";
                        estado = 0;
                    }
                    else if (c == '\n') {
                        fila++;
                        columna = 1;
                    }
                    break;
                case 13:
                    var tipo;
                    if (c == '+') {
                        lexema += c;
                        tipo = Tipo.masmas;
                    }
                    else {
                        tipo = Tipo.mas;
                        i--;
                    }
                    this.tokens.push(new Token(lexema, tipo, fila, columna));
                    lexema = "";
                    estado = 0;
                    break;
                case 15:
                    var tipo;
                    if (c == '-') {
                        lexema += c;
                        tipo = Tipo.menosmenos;
                    }
                    else {
                        tipo = Tipo.menos;
                        i--;
                    }
                    this.tokens.push(new Token(lexema, tipo, fila, columna));
                    lexema = "";
                    estado = 0;
                    break;
                case 17:
                    lexema += c;
                    estado = 18;
                    break;
                case 18:
                    lexema += c;
                    if (c == '\'') { //se acepta caracter
                        this.tokens.push(new Token(lexema, Tipo.caracter, fila, columna));
                        lexema = "";
                        estado = 0;
                    }
                    break;
            }
            columna++;
            this.depurado += c;
        }
    };
    Scanner.prototype.reservadas = function (lexema) {
        var lex = lexema.toLowerCase();
        switch (lex) {
            case "public":
                return Tipo.rpublic;
            case "private":
                return Tipo.rprivate;
            case "protected":
                return Tipo.rprotected;
            case "class":
                return Tipo.rclass;
            case "void":
                return Tipo.rvoid;
            case "system":
                return Tipo.rsystem;
            case "out":
                return Tipo.rout;
            case "print":
                return Tipo.rprint;
            case "println":
                return Tipo.rprintln;
            case "static":
                return Tipo.rstatic;
            case "false":
                return Tipo.rfalse;
            case "true":
                return Tipo.rtrue;
            case "boolean":
                return Tipo.rboolean;
            case "int":
                return Tipo.rint;
            case "double":
                return Tipo.rdouble;
            case "string":
                return Tipo.rstring;
            case "char":
                return Tipo.rchar;
            case "args":
                return Tipo.args;
            case "return":
                return Tipo.rreturn;
            case "break":
                return Tipo.rbreak;
            case "continue":
                return Tipo.rcontinue;
            case "if":
                return Tipo.rif;
            case "else":
                return Tipo.relse;
            case "do":
                return Tipo.rdo;
            case "while":
                return Tipo.rwhile;
            case "for":
                return Tipo.rfor;
            case "interface":
                return Tipo.rinterface;
            case "main":
                return Tipo.rmain;
            default:
                return Tipo.id;
        }
    };
    return Scanner;
}());
exports.Scanner = Scanner;
