"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var lexpython_1 = require("./lexpython");
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
        this.tokens.push(new lexpython_1.Token('$', lexpython_1.Tipo.dolar, 0, 0)); //se agrega un simbolo final para asegurarnos que no se pase del limite
        //aqui comienza el analisis
        this.INICIO();
        this.preanalisis = null;
        this.i = 0;
    };
    Parser.prototype.getNext = function () {
        if (this.i < this.tokens.length) {
            this.i++;
            this.preanalisis = this.tokens[this.i];
        }
    };
    Parser.prototype.Match = function (tk_tipo, descripcion) {
        //se encarga de identificar los tokens y verificar que coincidan
        var tipo = this.preanalisis.tipo;
        if (tk_tipo == tipo) {
            var tk = this.preanalisis;
            this.getNext();
            return tk;
        }
        this.Errores_(descripcion + "y se obtuvo " + this.preanalisis.lexema, this.preanalisis.fila, this.preanalisis.columna);
        this.Panico();
    };
    Parser.prototype.Errores_ = function (descripcion, fila, columna) {
        //guarda los errores sintacticos encontrados en la entrada
        this.errores.push(new lexpython_1.Error(lexpython_1.TipoErr.sintactico, fila, columna, descripcion));
    };
    Parser.prototype.Panico = function () {
        //se encarga de la recuperación del analisis
        this.getNext(); //vamos verificando hasta que encontremos un ;
        var tipo = this.preanalisis.tipo;
        while (!(tipo == lexpython_1.Tipo.puntoycoma || tipo == lexpython_1.Tipo.parder || tipo == lexpython_1.Tipo.llaveder)) {
            this.getNext();
            tipo = this.preanalisis.tipo;
        }
        //salió del ciclo, por lo cual encontro un ; ó ) ó }
        this.getNext(); //nos movemos al siguiente
    };
    Parser.prototype.INICIO = function () {
        this.CLASES();
    };
    Parser.prototype.CLASES = function () {
        if (this.preanalisis.tipo == lexpython_1.Tipo.dolar) {
            return;
        }
        this.CLASE();
        this.CLASES();
    };
    Parser.prototype.CLASE = function () {
        this.Match(lexpython_1.Tipo.rpublic, "Se esperaba la palabra Reservada 'public' ");
        this.TCLASS();
        this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
        this.BLOQUEC();
    };
    Parser.prototype.TCLASS = function () {
        var tipo = this.preanalisis.tipo;
        if (tipo == lexpython_1.Tipo.rclass) {
            this.Match(lexpython_1.Tipo.rclass, "Se esperaba la palabra reservada 'Class' ");
        }
        else if (tipo == lexpython_1.Tipo.rinterface) {
            this.Match(lexpython_1.Tipo.rinterface, "Se esperaba la palabra reservada 'Interface' ");
        }
    };
    Parser.prototype.BLOQUEC = function () {
        this.Match(lexpython_1.Tipo.llaveizq, "Se esperaba '{' ");
        this.INSTCLASE();
        this.Match(lexpython_1.Tipo.llaveder, "Se esperaba '}' ");
    };
    Parser.prototype.INSTCLASE = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.rpublic) {
            this.Match(lexpython_1.Tipo.rpublic, "Se esperaba la palabra Reservada 'public' ");
            this.FUNMET();
            return;
        }
        else if (tp == lexpython_1.Tipo.rint || tp == lexpython_1.Tipo.rstring || tp == lexpython_1.Tipo.rdouble || tp == lexpython_1.Tipo.rchar || tp == lexpython_1.Tipo.rboolean) {
            this.T();
            this.DECLARACION();
        }
    };
    Parser.prototype.FUNMET = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.rstatic) {
            this.Match(lexpython_1.Tipo.rstatic, "Se esperaba la palabra reservada 'static' ");
            this.Match(lexpython_1.Tipo.rvoid, "Se esperaba la palabra reservada 'void' ");
            this.Match(lexpython_1.Tipo.rmain, "Se esperaba la palabra reservada 'main' ");
            this.Match(lexpython_1.Tipo.parizq, "Se esperaba el simbolo '(' ");
            this.Match(lexpython_1.Tipo.rstring, "Se esperaba la palabra reservada 'String' ");
            this.Match(lexpython_1.Tipo.corizq, "Se esperaba el simbolo '[' ");
            this.Match(lexpython_1.Tipo.corder, "Se esperaba el simbolo ']' ");
            this.Match(lexpython_1.Tipo.args, "Se esperaba la palabra reservada 'args' ");
            this.Match(lexpython_1.Tipo.parder, "Se esperaba el simbolo ')' ");
            this.BLOQUEI();
            return;
        }
        this.T_FM();
        this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
        this.Match(lexpython_1.Tipo.parizq, "Se esperaba el simbolo '(' ");
        this.T();
        this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
        this.PARAMETROS();
        this.Match(lexpython_1.Tipo.parder, "Se esperaba el simbolo ')' ");
        this.T_IC();
    };
    Parser.prototype.PARAMETROS = function () {
        var tp = this.preanalisis;
        if (tp == lexpython_1.Tipo.coma) {
            this.Match(lexpython_1.Tipo.coma, "Se esperaba una ',' ");
            this.T();
            this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
            this.PARAMETROS();
        }
    };
    Parser.prototype.T_IC = function () {
        var tp = this.preanalisis;
        if (tp == lexpython_1.Tipo.puntoycoma) {
            this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba un ';' ");
            return;
        }
        this.BLOQUEI();
    };
    Parser.prototype.T_FM = function () {
        var tp = this.preanalisis;
        if (tp == lexpython_1.Tipo.rvoid) {
            this.Match(lexpython_1.Tipo.rvoid, "Se esperaba la palabra reservada 'void' ");
            return;
        }
        this.T();
    };
    Parser.prototype.DECLARACION = function () {
        this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
        this.ASIGNACION();
        this.VAL2();
    };
    Parser.prototype.ASIGNACION = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.igual) {
            this.Match(lexpython_1.Tipo.igual, "Se esperaba '=' ");
            this.EXP();
        }
    };
    Parser.prototype.VAL2 = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.coma) {
            this.Match(lexpython_1.Tipo.coma, "Se esperaba ',' ");
            this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
            this.ASIGNACION();
            this.VAL2();
        }
    };
    Parser.prototype.T = function () {
        var tk = this.preanalisis;
        var tp = tk.tipo;
        switch (tp) {
            case lexpython_1.Tipo.rint:
                this.Match(tp, "Se esperaba la palabra reservada 'int' ");
                break;
            case lexpython_1.Tipo.rdouble:
                this.Match(tp, "Se esperaba la palabra reservada 'double' ");
                break;
            case lexpython_1.Tipo.rstring:
                this.Match(tp, "Se esperaba la palabra reservada 'string' ");
                break;
            case lexpython_1.Tipo.rboolean:
                this.Match(tp, "Se esperaba la palabra reservada 'boolean' ");
                break;
            case lexpython_1.Tipo.rchar:
                this.Match(tp, "Se esperaba la palabra reservada 'char' ");
                break;
            default:
                this.Errores_("Se esperaba 'string','char','int','double' o 'boolean';\nen su lugar vino " + tk.lexema, tk.fila, tk.columna);
                this.Panico();
                break;
        }
    };
    Parser.prototype.BLOQUEI = function () {
        this.Match(lexpython_1.Tipo.llaveizq, "Se esperaba una '{' ");
        this.INSTRUCCIONES();
        this.Match(lexpython_1.Tipo.llaveder, "Se esperaba '}' ");
    };
    Parser.prototype.INSTRUCCIONES = function () {
        this.INSTRUCCION();
        this.INSTRUCCIONES();
    };
    Parser.prototype.INSTRUCCION = function () {
        var tp = this.preanalisis.tipo;
        switch (tp) {
            case lexpython_1.Tipo.rfor:
                this.Match(lexpython_1.Tipo.rfor, "Se esperaba la palabra reservada 'for' ");
                this.FOR_();
                break;
            case lexpython_1.Tipo.rwhile:
                this.Match(lexpython_1.Tipo.rwhile, "Se esperaba la palabra reservada 'while' ");
                this.WHILE_();
                break;
            case lexpython_1.Tipo.rdo:
                this.Match(lexpython_1.Tipo.rdo, "Se esperaba la palabra reservada 'do' ");
                this.DOWHILE_();
                break;
            case lexpython_1.Tipo.rif:
                this.Match(lexpython_1.Tipo.rif, "Se esperaba la palabra reservada 'if' ");
                this.IF_();
                break;
            case lexpython_1.Tipo.rbreak:
                this.Match(lexpython_1.Tipo.rbreak, "Se esperaba la palabra reservada 'break' ");
                this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
                break;
            case lexpython_1.Tipo.rcontinue:
                this.Match(lexpython_1.Tipo.rcontinue, "Se esperaba la palabra reservada 'continue' ");
                this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
                break;
            case lexpython_1.Tipo.rreturn:
                this.Match(lexpython_1.Tipo.rreturn, "Se esperaba la palabra reservada 'return' ");
                this.EXP();
                this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
                break;
            case lexpython_1.Tipo.rsystem:
                this.Match(lexpython_1.Tipo.rsystem, "Se esperaba la palabra reservada 'system' ");
                this.IMPRIMIR();
                this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
                break;
            case lexpython_1.Tipo.id:
                this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
                this.ASIG_LLAMA();
                this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
                break;
            default:
                this.T();
                this.DECLARACION();
                this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
                break;
        }
    };
    Parser.prototype.ASIG_LLAMA = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.igual) {
            this.Match(lexpython_1.Tipo.igual, "Se esperaba '=' ");
            this.EXP();
            return;
        }
        this.Match(lexpython_1.Tipo.parizq, "Se esperaba '(' ");
        this.EXP();
        this.VALORES();
        this.Match(lexpython_1.Tipo.parder, "Se esperaba ')' ");
    };
    Parser.prototype.VALORES = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.coma) {
            this.Match(lexpython_1.Tipo.coma, "Se esperaba ',' ");
            this.EXP();
            this.VALORES();
        }
    };
    Parser.prototype.IMPRIMIR = function () {
        this.Match(lexpython_1.Tipo.punto, "Se esperaba un '.' ");
        this.Match(lexpython_1.Tipo.rout, "Se esperaba la palabra reservada 'out' ");
        this.Match(lexpython_1.Tipo.punto, "Se esperaba un '.' ");
        this.IMPRIMIR_1();
        this.Match(lexpython_1.Tipo.parizq, "Se esperaba un '(' ");
        this.EXP();
        this.Match(lexpython_1.Tipo.parder, "Se esperaba ')' ");
    };
    Parser.prototype.IMPRIMIR_1 = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.rprint) {
            this.Match(lexpython_1.Tipo.rprint, "Se esperaba la palabra reservada 'print' ");
            return;
        }
        this.Match(lexpython_1.Tipo.rprintln, "Se esperaba la palabra reservada 'println' ");
    };
    Parser.prototype.IF_ = function () {
        this.Match(lexpython_1.Tipo.parizq, "Se esperaba '(' ");
        this.EXP();
        this.Match(lexpython_1.Tipo.parder, "Se esperaba ')' ");
        this.BLOQUEI();
        this.ELSE_();
    };
    Parser.prototype.ELSE_ = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.relse) {
            this.Match(lexpython_1.Tipo.relse, "Se esperaba la palabra reservada 'else' ");
            this.ELSE_1();
        }
    };
    Parser.prototype.ELSE_1 = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.rif) {
            this.Match(lexpython_1.Tipo.rif, "Se esperaba la palabra reservada 'if' ");
            this.IF_();
            return;
        }
        this.BLOQUEI();
    };
    Parser.prototype.DOWHILE_ = function () {
        this.BLOQUEI();
        this.Match(lexpython_1.Tipo.rwhile, "Se esperaba la palabra reservada 'while' ");
        this.Match(lexpython_1.Tipo.parizq, "Se esperaba '(' ");
        this.EXP();
        this.Match(lexpython_1.Tipo.parder, "Se esperaba ')' ");
        this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
    };
    Parser.prototype.WHILE_ = function () {
        this.Match(lexpython_1.Tipo.parizq, "Se esperaba '(' ");
        this.EXP();
        this.Match(lexpython_1.Tipo.parder, "Se esperaba ')' ");
        this.BLOQUEI();
    };
    Parser.prototype.FOR_ = function () {
        this.Match(lexpython_1.Tipo.parizq, "Se esperaba '(' ");
        this.T();
        this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
        this.Match(lexpython_1.Tipo.igual, "Se esperaba '=' ");
        this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
        this.EXP();
        this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
        this.EXP();
        this.Match(lexpython_1.Tipo.parder, "Se esperaba ')' ");
        this.BLOQUEI();
    };
    Parser.prototype.EXP = function () {
        this.A();
    };
    Parser.prototype.A = function () {
        this.B();
        this.A_1();
    };
    Parser.prototype.A_1 = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.or) {
            this.Match(lexpython_1.Tipo.or, "Se esperaba '|' ");
            this.Match(lexpython_1.Tipo.or, "Se esperaba '|' ");
            this.B();
            this.A_1();
        }
    };
    Parser.prototype.B = function () {
        this.C();
        this.B_1();
    };
    Parser.prototype.B_1 = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.xor) {
            this.Match(lexpython_1.Tipo.xor, "Se esperaba '^' ");
            this.C();
            this.B_1();
        }
    };
    Parser.prototype.C = function () {
        this.D();
        this.C_1();
    };
    Parser.prototype.C_1 = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.and) {
            this.Match(lexpython_1.Tipo.and, "Se esperaba '&' ");
            this.Match(lexpython_1.Tipo.and, "Se esperaba '&' ");
            this.D();
            this.C_1();
        }
    };
    Parser.prototype.D = function () {
        this.E();
        this.D_1();
    };
    Parser.prototype.D_1 = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.igual) {
            this.Match(lexpython_1.Tipo.igual, "Se esperaba '=' ");
            this.Match(lexpython_1.Tipo.igual, "Se esperaba '=' ");
            this.E();
            this.D_1();
        }
    };
    Parser.prototype.E = function () {
        this.F();
        this.E_1();
    };
    Parser.prototype.E_1 = function () {
        var tp = this.preanalisis.tipo;
        switch (tp) {
            case lexpython_1.Tipo.menor:
                this.Match(lexpython_1.Tipo.menor, "Se esperaba '<' ");
                this.E_2();
                break;
            case lexpython_1.Tipo.mayor:
                this.Match(lexpython_1.Tipo.mayor, "Se esperaba '>' ");
                this.E_2();
                break;
        }
    };
    Parser.prototype.E_2 = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.igual) {
            this.Match(lexpython_1.Tipo.igual, "Se esperaba '=' ");
            this.F();
            this.E_1();
            return;
        }
        this.F();
        this.E_1();
    };
    Parser.prototype.F = function () {
        this.G();
        this.F_1();
    };
    Parser.prototype.F_1 = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.mas) {
            this.Match(lexpython_1.Tipo.mas, "Se esperaba '+' ");
            this.G();
            this.F_1();
        }
        else if (tp == lexpython_1.Tipo.menos) {
            this.Match(lexpython_1.Tipo.menos, "Se esperaba '-' ");
            this.G();
            this.F_1();
        }
    };
    Parser.prototype.G = function () {
        this.H();
        this.G_1();
    };
    Parser.prototype.G_1 = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.por) {
            this.Match(lexpython_1.Tipo.por, "Se esperaba '*' ");
            this.H();
            this.G_1();
        }
        else if (tp == lexpython_1.Tipo.division) {
            this.Match(lexpython_1.Tipo.division, "Se esperaba '/' ");
            this.H();
            this.G_1();
        }
    };
    Parser.prototype.H = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.id) {
            this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
            this.J();
            return;
        }
        this.K();
    };
    Parser.prototype.J = function () {
        var tp = this.preanalisis.tipo;
        switch (tp) {
            case lexpython_1.Tipo.masmas:
                this.Match(lexpython_1.Tipo.masmas, "Se esperaba '++' ");
                break;
            case lexpython_1.Tipo.menosmenos:
                this.Match(lexpython_1.Tipo.menosmenos, "Se esperaba '--' ");
                break;
            case lexpython_1.Tipo.parizq:
                this.Match(lexpython_1.Tipo.parizq, "Se esperaba '(' ");
                this.VALORES();
                this.Match(lexpython_1.Tipo.parder, "Se esperaba ')' ");
                break;
        }
    };
    Parser.prototype.K = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.parder) {
            this.Match(lexpython_1.Tipo.parizq, "Se esperaba '(' ");
            this.A();
            this.Match(lexpython_1.Tipo.parder, "Se esperaba ')' ");
            return;
        }
        this.VALOR();
    };
    Parser.prototype.VALOR = function () {
        var tk = this.preanalisis;
        var tp = tk.tipo;
        switch (tp) {
            case lexpython_1.Tipo.cadena:
                this.Match(lexpython_1.Tipo.cadena, "Se esperaba una cadena ");
                break;
            case lexpython_1.Tipo.caracter:
                this.Match(lexpython_1.Tipo.caracter, "Se esperaba un caracter ");
                break;
            case lexpython_1.Tipo.entero:
                this.Match(lexpython_1.Tipo.entero, "Se esperaba un numero entero");
                break;
            case lexpython_1.Tipo.double:
                this.Match(lexpython_1.Tipo.double, "Se esperaba un numero decimal ");
                break;
            case lexpython_1.Tipo.rtrue:
                this.Match(lexpython_1.Tipo.rtrue, "Se esperaba un valor booleano ");
                break;
            case lexpython_1.Tipo.rfalse:
                this.Match(lexpython_1.Tipo.rfalse, "Se esperaba un valor booleano ");
                break;
            default:
                this.Errores_("Se esperaba un valor string,char,int,double o boolean y se obtuvo " + tk.lexema, tk.fila, tk.columna);
                this.Panico();
                break;
        }
    };
    return Parser;
}());
exports.Parser = Parser;
