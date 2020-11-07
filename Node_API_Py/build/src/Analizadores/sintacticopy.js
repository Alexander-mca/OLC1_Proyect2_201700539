"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexpython_1 = require("./lexpython");
var Parser = /** @class */ (function () {
    function Parser() {
        this.i = 0;
        this.tokens = [];
        this.errores = [];
        this.preanalisis = new lexpython_1.Token("", lexpython_1.Tipo.dolar, 0, 0);
        this.traduccion = "";
        this.tabs = "";
    }
    Parser.prototype.ejecutar = function (Scan) {
        this.tokens = Scan.tokens;
        this.errores = Scan.errores;
        this.traduccion = "";
        this.tabs = "";
        this.preanalisis = this.tokens[this.i];
        this.tokens.push(new lexpython_1.Token('$', lexpython_1.Tipo.dolar, 0, 0)); //se agrega un simbolo final para asegurarnos que no se pase del limite
        //aqui comienza el analisis
        this.INICIO();
        this.i = 0;
        this.tabs = "";
        return { Tokens: this.tokens, Errores: this.errores, Traduccion: this.traduccion };
    };
    Parser.prototype.getNext = function () {
        if (this.i < this.tokens.length) {
            this.i++;
            if (this.tokens[this.i] == undefined) {
                return;
            }
            this.preanalisis = this.tokens[this.i];
        }
    };
    Parser.prototype.Match = function (tk_tipo, descripcion) {
        //se encarga de identificar los tokens y verificar que coincidan
        var tk = this.preanalisis;
        var tipo = tk.tipo;
        if (tk_tipo == tipo) {
            this.getNext();
            return tk;
        }
        if (tipo == lexpython_1.Tipo.comentarioSimple) {
            //se traduce el comentario                
            this.traduccion += "\n" + this.tabs + "#" + tk.lexema.substring(2, tk.lexema.length);
            //se pasa al siguiente token
            this.getNext();
            var val = this.Match(tk_tipo, descripcion);
            return val;
        }
        if (tipo == lexpython_1.Tipo.comentarioMulti) {
            //comentario multiple
            this.traduccion += "\n" + this.tabs + "'''" + tk.lexema.substring(2, tk.lexema.length - 3) + "'''\n";
            this.getNext();
            var val = this.Match(tk_tipo, descripcion);
            return val;
        }
        this.Errores_(descripcion + "y se obtuvo " + this.preanalisis.lexema, this.preanalisis.fila, this.preanalisis.columna);
        this.Panico();
        return undefined;
    };
    Parser.prototype.Errores_ = function (descripcion, fila, columna) {
        //guarda los errores sintacticos encontrados en la entrada
        this.errores.push(new lexpython_1.Error(lexpython_1.TipoErr.sintactico, fila, columna, descripcion));
        console.log("Error Sintactico:" + descripcion + ", Fila:" + String(fila) + ", Columna:" + String(columna));
    };
    Parser.prototype.Panico = function () {
        //se encarga de la recuperación del analisis
        this.getNext(); //vamos verificando hasta que encontremos un ;
        if (this.preanalisis == undefined) {
            return;
        }
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
        var tk;
        this.Match(lexpython_1.Tipo.rpublic, "Se esperaba la palabra Reservada 'public' ");
        var val = this.TCLASS();
        tk = this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
        if (tk != undefined) {
            this.tabs += "\t";
            this.traduccion += tk.lexema;
        }
        this.BLOQUEC();
        //elimina un tab
        this.UnTabMenos();
    };
    Parser.prototype.UnTabMenos = function () {
        if (this.tabs.length == 0) {
            return;
        }
        this.tabs = this.tabs.substring(0, this.tabs.length - 1);
    };
    Parser.prototype.TCLASS = function () {
        var tk;
        var tipo = this.preanalisis.tipo;
        if (tipo == lexpython_1.Tipo.rclass) {
            tk = this.Match(lexpython_1.Tipo.rclass, "Se esperaba la palabra reservada 'Class' ");
            this.traduccion += "\nclass ";
            return "class";
        }
        else if (tipo == lexpython_1.Tipo.rinterface) {
            tk = this.Match(lexpython_1.Tipo.rinterface, "Se esperaba la palabra reservada 'Interface' ");
            return "interface";
        }
    };
    Parser.prototype.BLOQUEC = function () {
        var tk;
        tk = this.Match(lexpython_1.Tipo.llaveizq, "Se esperaba '{' ");
        if (tk != undefined) {
            this.traduccion += ":\n";
        }
        this.INSTCLASE();
        tk = this.Match(lexpython_1.Tipo.llaveder, "Se esperaba '}' ");
        if (tk != undefined) {
            this.UnTabMenos();
        }
    };
    Parser.prototype.INSTCLASE = function () {
        var tk = this.preanalisis;
        var tp = tk.tipo;
        if (tp == lexpython_1.Tipo.rpublic) {
            this.Match(lexpython_1.Tipo.rpublic, "Se esperaba la palabra Reservada 'public' ");
            this.FUNMET();
            this.INSTCLASE();
            return;
        }
        else if (tp == lexpython_1.Tipo.rint || tp == lexpython_1.Tipo.rstring || tp == lexpython_1.Tipo.rdouble || tp == lexpython_1.Tipo.rchar || tp == lexpython_1.Tipo.rboolean) {
            tk = this.T();
            this.DECLARACION();
            tk = this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba un ';' ");
            this.INSTCLASE();
        }
        else if (tp == lexpython_1.Tipo.comentarioMulti) {
            //comentario multiple
            this.traduccion += "\n" + this.tabs + "'''" + tk.lexema.substring(2, tk.lexema.length - 2) + "'''\n";
            this.getNext();
        }
        else if (tp == lexpython_1.Tipo.comentarioSimple) {
            //se traduce el comentario                
            this.traduccion += "\n" + this.tabs + "#" + tk.lexema.substring(2, tk.lexema.length);
            //se pasa al siguiente token
            this.getNext();
        }
    };
    Parser.prototype.FUNMET = function () {
        var tk;
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.rstatic) {
            this.Match(lexpython_1.Tipo.rstatic, "Se esperaba la palabra reservada 'static' ");
            this.Match(lexpython_1.Tipo.rvoid, "Se esperaba la palabra reservada 'void' ");
            tk = this.Match(lexpython_1.Tipo.rmain, "Se esperaba la palabra reservada 'main' ");
            if (tk != undefined) {
                this.traduccion += "\n" + this.tabs + "def main()";
            }
            this.Match(lexpython_1.Tipo.parizq, "Se esperaba el simbolo '(' ");
            this.Match(lexpython_1.Tipo.rstring, "Se esperaba la palabra reservada 'String' ");
            this.Match(lexpython_1.Tipo.corizq, "Se esperaba el simbolo '[' ");
            this.Match(lexpython_1.Tipo.corder, "Se esperaba el simbolo ']' ");
            this.Match(lexpython_1.Tipo.args, "Se esperaba la palabra reservada 'args' ");
            this.Match(lexpython_1.Tipo.parder, "Se esperaba el simbolo ')' ");
            this.BLOQUEI();
            this.traduccion += "\n" + this.tabs + "if__name__=\"__main__\":";
            this.traduccion += "\n\t" + this.tabs + "main()";
            return;
        } //buscar error por las funciones metodos
        tk = this.T_FM();
        if (tk != undefined) {
            this.traduccion += "\n" + this.tabs + " self ";
        }
        tk = this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
        if (tk != undefined) {
            this.traduccion += tk.lexema;
        }
        tk = this.Match(lexpython_1.Tipo.parizq, "Se esperaba el simbolo '(' ");
        if (tk != undefined) {
            this.traduccion += "(";
        }
        this.PARM1();
        tk = this.Match(lexpython_1.Tipo.parder, "Se esperaba el simbolo ')' ");
        if (tk != undefined) {
            this.traduccion += ")";
        }
        this.T_IC();
    };
    Parser.prototype.PARM1 = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.rint || tp == lexpython_1.Tipo.rboolean || tp == lexpython_1.Tipo.rstring || tp == lexpython_1.Tipo.rchar || tp == lexpython_1.Tipo.rdouble) {
            this.T();
            var tk = this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
            if (tk != undefined) {
                this.traduccion += tk.lexema;
            }
            this.PARAMETROS();
        }
    };
    Parser.prototype.PARAMETROS = function () {
        var tk = this.preanalisis;
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.coma) {
            this.Match(lexpython_1.Tipo.coma, "Se esperaba una ',' ");
            this.traduccion += ", ";
            tk = this.T();
            tk = this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
            if (tk != undefined) {
                this.traduccion += tk.lexema;
            }
            this.PARAMETROS();
        }
    };
    Parser.prototype.T_IC = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.puntoycoma) {
            this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba un ';' ");
            this.traduccion += ";";
            return;
        }
        this.BLOQUEI();
    };
    Parser.prototype.T_FM = function () {
        var tk = this.preanalisis;
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.rvoid) {
            tk = this.Match(lexpython_1.Tipo.rvoid, "Se esperaba la palabra reservada 'void' ");
        }
        else {
            tk = this.T();
        }
        return tk;
    };
    Parser.prototype.DECLARACION = function () {
        var tk = this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
        if (tk != undefined) {
            this.traduccion += "\n" + this.tabs + tk.lexema;
        }
        this.ASIGNACION();
        this.VAL2();
    };
    Parser.prototype.ASIGNACION = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.igual) {
            this.Match(lexpython_1.Tipo.igual, "Se esperaba '=' ");
            this.traduccion += "=";
            this.EXP();
        }
    };
    Parser.prototype.VAL2 = function () {
        var tk;
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.coma) {
            tk = this.Match(lexpython_1.Tipo.coma, "Se esperaba ',' ");
            if (tk != undefined) {
                this.traduccion += ", ";
            }
            tk = this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
            if (tk != undefined) {
                this.traduccion += tk.lexema;
            }
            this.ASIGNACION();
            this.VAL2();
        }
    };
    Parser.prototype.T = function () {
        var tk = this.preanalisis;
        var tp = tk.tipo;
        switch (tp) {
            case lexpython_1.Tipo.rint:
                tk = this.Match(tp, "Se esperaba la palabra reservada 'int' ");
                break;
            case lexpython_1.Tipo.rdouble:
                tk = this.Match(tp, "Se esperaba la palabra reservada 'double' ");
                break;
            case lexpython_1.Tipo.rstring:
                tk = this.Match(tp, "Se esperaba la palabra reservada 'string' ");
                break;
            case lexpython_1.Tipo.rboolean:
                tk = this.Match(tp, "Se esperaba la palabra reservada 'boolean' ");
                break;
            case lexpython_1.Tipo.rchar:
                tk = this.Match(tp, "Se esperaba la palabra reservada 'char' ");
                break;
            default:
                this.Errores_("Se esperaba 'string','char','int','double' o 'boolean';\nen su lugar vino " + tk.lexema, tk.fila, tk.columna);
                this.Panico();
                return undefined;
        }
        return tk;
    };
    Parser.prototype.BLOQUEI = function () {
        var tk;
        tk = this.Match(lexpython_1.Tipo.llaveizq, "Se esperaba una '{' ");
        if (tk != undefined) {
            this.traduccion += ":";
            this.tabs += "\t";
        }
        this.INSTRUCCIONES();
        tk = this.Match(lexpython_1.Tipo.llaveder, "Se esperaba '}' ");
        if (tk != undefined) {
            this.UnTabMenos();
        }
    };
    Parser.prototype.INSTRUCCIONES = function () {
        if (this.preanalisis.tipo == lexpython_1.Tipo.llaveder) {
            return;
        }
        this.INSTRUCCION();
        this.INSTRUCCIONES();
    };
    Parser.prototype.INSTRUCCION = function () {
        var tk = this.preanalisis;
        var tp = this.preanalisis.tipo;
        switch (tp) {
            case lexpython_1.Tipo.rfor:
                tk = this.Match(lexpython_1.Tipo.rfor, "Se esperaba la palabra reservada 'for' ");
                if (tk != undefined) {
                    this.traduccion += "\n" + this.tabs + tk.lexema + " ";
                }
                this.FOR_();
                break;
            case lexpython_1.Tipo.rwhile:
                tk = this.Match(lexpython_1.Tipo.rwhile, "Se esperaba la palabra reservada 'while' ");
                if (tk != undefined) {
                    this.traduccion += "\n" + this.tabs + tk.lexema + " ";
                }
                this.WHILE_();
                break;
            case lexpython_1.Tipo.rdo:
                tk = this.Match(lexpython_1.Tipo.rdo, "Se esperaba la palabra reservada 'do' ");
                if (tk != undefined) {
                    this.tabs += "\t";
                    this.traduccion += "\n" + this.tabs + "while True";
                }
                this.DOWHILE_();
                this.UnTabMenos();
                break;
            case lexpython_1.Tipo.rif:
                tk = this.Match(lexpython_1.Tipo.rif, "Se esperaba la palabra reservada 'if' ");
                if (tk != undefined) {
                    this.traduccion += "\n" + this.tabs;
                }
                this.IF_();
                break;
            case lexpython_1.Tipo.rbreak:
                this.Match(lexpython_1.Tipo.rbreak, "Se esperaba la palabra reservada 'break' ");
                this.traduccion += "\n" + this.tabs + "break\n";
                this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
                break;
            case lexpython_1.Tipo.rcontinue:
                this.Match(lexpython_1.Tipo.rcontinue, "Se esperaba la palabra reservada 'continue' ");
                this.traduccion += "\n" + this.tabs + "continue\n";
                this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
                break;
            case lexpython_1.Tipo.rreturn:
                this.Match(lexpython_1.Tipo.rreturn, "Se esperaba la palabra reservada 'return' ");
                this.traduccion += "\n" + this.tabs + "return ";
                this.EXP();
                this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
                break;
            case lexpython_1.Tipo.rsystem:
                this.Match(lexpython_1.Tipo.rsystem, "Se esperaba la palabra reservada 'system' ");
                this.traduccion += "\n" + this.tabs;
                this.IMPRIMIR();
                this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
                break;
            case lexpython_1.Tipo.id:
                this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
                this.traduccion += "\n" + this.tabs + tk.lexema + " ";
                this.ASIG_LLAMA();
                tk = this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
                break;
            case lexpython_1.Tipo.comentarioMulti:
                //comentario multiple
                this.traduccion += "\n" + this.tabs + "'''" + tk.lexema.substring(2, tk.lexema.length - 2) + "'''\n";
                this.getNext();
                break;
            case lexpython_1.Tipo.comentarioSimple:
                //se traduce el comentario                
                this.traduccion += "\n" + this.tabs + "#" + tk.lexema.substring(2, tk.lexema.length);
                //se pasa al siguiente token
                this.getNext();
                break;
            default:
                tk = this.T();
                this.DECLARACION();
                this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
                break;
        }
    };
    Parser.prototype.ASIG_LLAMA = function () {
        var tk;
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.igual) {
            tk = this.Match(lexpython_1.Tipo.igual, "Se esperaba '=' ");
            if (tk != undefined) {
                this.traduccion += " = ";
            }
            this.EXP();
            return;
        }
        else if (tp == lexpython_1.Tipo.masmas) {
            tk = this.Match(lexpython_1.Tipo.masmas, "Se esperaba '++' ");
            if (tk != undefined) {
                this.traduccion += " += 1 ";
            }
            return;
        }
        else if (tp == lexpython_1.Tipo.menosmenos) {
            tk = this.Match(lexpython_1.Tipo.menosmenos, "Se esperaba '--' ");
            if (tk != undefined) {
                this.traduccion += " -= 1 ";
            }
            return;
        }
        tk = this.Match(lexpython_1.Tipo.parizq, "Se esperaba '(' ");
        if (tk != undefined) {
            this.traduccion += "(";
        }
        this.EXP();
        this.VALORES();
        tk = this.Match(lexpython_1.Tipo.parder, "Se esperaba ')' ");
        if (tk != undefined) {
            this.traduccion += ")";
        }
    };
    Parser.prototype.VALORES = function () {
        var tk;
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.coma) {
            tk = this.Match(lexpython_1.Tipo.coma, "Se esperaba ',' ");
            if (tk != undefined) {
                this.traduccion += ", ";
            }
            this.EXP();
            this.VALORES();
        }
    };
    Parser.prototype.IMPRIMIR = function () {
        var tk;
        this.Match(lexpython_1.Tipo.punto, "Se esperaba un '.' ");
        this.Match(lexpython_1.Tipo.rout, "Se esperaba la palabra reservada 'out' ");
        tk = this.Match(lexpython_1.Tipo.punto, "Se esperaba un '.' ");
        var aux = this.IMPRIMIR_1();
        if (aux != undefined) {
            this.traduccion += "print";
        }
        tk = this.Match(lexpython_1.Tipo.parizq, "Se esperaba un '(' ");
        if (tk == undefined) {
            return;
        }
        else {
            this.traduccion += "(";
        }
        this.EXP();
        if (aux != undefined && aux.tipo == lexpython_1.Tipo.rprintln) {
            this.traduccion += ", end=\"\"";
        }
        tk = this.Match(lexpython_1.Tipo.parder, "Se esperaba ')' ");
        if (tk != undefined) {
            this.traduccion += ")";
        }
    };
    Parser.prototype.IMPRIMIR_1 = function () {
        var tk;
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.rprint) {
            tk = this.Match(lexpython_1.Tipo.rprint, "Se esperaba la palabra reservada 'print' ");
            return tk;
        }
        tk = this.Match(lexpython_1.Tipo.rprintln, "Se esperaba la palabra reservada 'println' ");
        return tk;
    };
    Parser.prototype.IF_ = function () {
        var tk;
        tk = this.Match(lexpython_1.Tipo.parizq, "Se esperaba '(' ");
        if (tk != undefined) {
            this.traduccion += "if ";
        }
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
            this.traduccion += "\n" + this.tabs + "el";
            this.IF_();
            return;
        }
        this.traduccion += "\n" + this.tabs + "else ";
        this.BLOQUEI();
    };
    Parser.prototype.DOWHILE_ = function () {
        var tk;
        this.BLOQUEI();
        tk = this.Match(lexpython_1.Tipo.rwhile, "Se esperaba la palabra reservada 'while' ");
        if (tk != undefined) {
            this.tabs += "\t";
            this.traduccion += "if ";
        }
        tk = this.Match(lexpython_1.Tipo.parizq, "Se esperaba '(' ");
        this.EXP();
        this.Match(lexpython_1.Tipo.parder, "Se esperaba ')' ");
        this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
        this.traduccion += ":\n" + this.tabs + "break";
        this.UnTabMenos();
    };
    Parser.prototype.WHILE_ = function () {
        this.Match(lexpython_1.Tipo.parizq, "Se esperaba '(' ");
        this.EXP();
        this.Match(lexpython_1.Tipo.parder, "Se esperaba ')' ");
        this.BLOQUEI();
    };
    Parser.prototype.FOR_ = function () {
        var tk;
        this.Match(lexpython_1.Tipo.parizq, "Se esperaba '(' ");
        this.T();
        tk = this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
        if (tk != undefined) {
            this.traduccion += tk.lexema + " in range (";
        }
        this.Match(lexpython_1.Tipo.igual, "Se esperaba '=' ");
        this.EXP();
        this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
        this.traduccion += ", ";
        this.EXP();
        this.Match(lexpython_1.Tipo.puntoycoma, "Se esperaba ';' ");
        this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
        this.AUM();
        tk = this.Match(lexpython_1.Tipo.parder, "Se esperaba ')' ");
        if (tk != undefined) {
            this.traduccion += ")";
        }
        this.BLOQUEI();
    };
    Parser.prototype.AUM = function () {
        var tk = this.preanalisis;
        var tp = tk.tipo;
        if (tp == lexpython_1.Tipo.masmas) {
            this.Match(lexpython_1.Tipo.masmas, "Se esperaba '++' ");
            return;
        }
        this.Match(lexpython_1.Tipo.menosmenos, "Se esperaba '--' ");
    };
    Parser.prototype.EXP = function () {
        this.A();
    };
    Parser.prototype.A = function () {
        this.B();
        this.A_1();
    };
    Parser.prototype.A_1 = function () {
        var tk;
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.or) {
            tk = this.Match(lexpython_1.Tipo.or, "Se esperaba '|' ");
            tk = this.Match(lexpython_1.Tipo.or, "Se esperaba '|' ");
            if (tk != undefined) {
                this.traduccion += " or ";
            }
            this.B();
            this.A_1();
        }
    };
    Parser.prototype.B = function () {
        this.C();
        this.B_1();
    };
    Parser.prototype.B_1 = function () {
        var tk;
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.xor) {
            tk = this.Match(lexpython_1.Tipo.xor, "Se esperaba '^' ");
            if (tk != undefined) {
                this.traduccion += " xor ";
            }
            this.C();
            this.B_1();
        }
    };
    Parser.prototype.C = function () {
        this.D();
        this.C_1();
    };
    Parser.prototype.C_1 = function () {
        var tk;
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.and) {
            tk = this.Match(lexpython_1.Tipo.and, "Se esperaba '&' ");
            tk = this.Match(lexpython_1.Tipo.and, "Se esperaba '&' ");
            if (tk != undefined) {
                this.traduccion += " and ";
            }
            this.D();
            this.C_1();
        }
    };
    Parser.prototype.D = function () {
        this.E();
        this.D_1();
    };
    Parser.prototype.D_1 = function () {
        var tk;
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.igual) {
            tk = this.Match(lexpython_1.Tipo.igual, "Se esperaba '=' ");
            tk = this.Match(lexpython_1.Tipo.igual, "Se esperaba '=' ");
            if (tk != undefined) {
                this.traduccion += "==";
            }
            this.E();
            this.D_1();
        }
        else if (tp == lexpython_1.Tipo.diferente) {
            tk = this.Match(lexpython_1.Tipo.diferente, "Se esperaba '!=' ");
            if (tk != undefined) {
                this.traduccion += "!=";
            }
            this.E();
            this.D_1();
        }
    };
    Parser.prototype.E = function () {
        this.F();
        this.E_1();
    };
    Parser.prototype.E_1 = function () {
        var tk;
        var tp = this.preanalisis.tipo;
        switch (tp) {
            case lexpython_1.Tipo.menor:
                tk = this.Match(lexpython_1.Tipo.menor, "Se esperaba '<' ");
                if (tk != undefined) {
                    this.traduccion += "<";
                }
                this.E_2();
                break;
            case lexpython_1.Tipo.mayor:
                tk = this.Match(lexpython_1.Tipo.mayor, "Se esperaba '>' ");
                if (tk != undefined) {
                    this.traduccion += ">";
                }
                this.E_2();
                break;
        }
    };
    Parser.prototype.E_2 = function () {
        var tk;
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.igual) {
            tk = this.Match(lexpython_1.Tipo.igual, "Se esperaba '=' ");
            if (tk != undefined) {
                this.traduccion += "=";
            }
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
        var tk;
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.mas) {
            tk = this.Match(lexpython_1.Tipo.mas, "Se esperaba '+' ");
            if (tk != undefined) {
                this.traduccion += " + ";
            }
            this.G();
            this.F_1();
        }
        else if (tp == lexpython_1.Tipo.menos) {
            tk = this.Match(lexpython_1.Tipo.menos, "Se esperaba '-' ");
            if (tk != undefined) {
                this.traduccion += " - ";
            }
            this.G();
            this.F_1();
        }
    };
    Parser.prototype.G = function () {
        this.H();
        this.G_1();
    };
    Parser.prototype.G_1 = function () {
        var tk;
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.por) {
            tk = this.Match(lexpython_1.Tipo.por, "Se esperaba '*' ");
            if (tk != undefined) {
                this.traduccion += " * ";
            }
            this.H();
            this.G_1();
        }
        else if (tp == lexpython_1.Tipo.division) {
            tk = this.Match(lexpython_1.Tipo.division, "Se esperaba '/' ");
            if (tk != undefined) {
                this.traduccion += " / ";
            }
            this.H();
            this.G_1();
        }
    };
    Parser.prototype.H = function () {
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.id) {
            var tk = this.Match(lexpython_1.Tipo.id, "Se esperaba un id ");
            if (tk != undefined) {
                this.traduccion += tk.lexema;
            }
            this.J();
            return;
        }
        this.K();
    };
    Parser.prototype.J = function () {
        var tk;
        var tp = this.preanalisis.tipo;
        switch (tp) {
            case lexpython_1.Tipo.masmas:
                tk = this.Match(lexpython_1.Tipo.masmas, "Se esperaba '++' ");
                if (tk != undefined) {
                    this.traduccion += " += 1 ";
                }
                break;
            case lexpython_1.Tipo.menosmenos:
                tk = this.Match(lexpython_1.Tipo.menosmenos, "Se esperaba '--' ");
                if (tk != undefined) {
                    this.traduccion += " -= 1 ";
                }
                break;
            case lexpython_1.Tipo.parizq:
                tk = this.Match(lexpython_1.Tipo.parizq, "Se esperaba '(' ");
                if (tk != undefined) {
                    this.traduccion += "(";
                }
                this.VALORES();
                tk = this.Match(lexpython_1.Tipo.parder, "Se esperaba ')' ");
                if (tk != undefined) {
                    this.traduccion += ")";
                }
                break;
        }
    };
    Parser.prototype.K = function () {
        var tk;
        var tp = this.preanalisis.tipo;
        if (tp == lexpython_1.Tipo.parizq) {
            tk = this.Match(lexpython_1.Tipo.parizq, "Se esperaba '(' ");
            if (tk != undefined) {
                this.traduccion += "(";
            }
            this.A();
            tk = this.Match(lexpython_1.Tipo.parder, "Se esperaba ')' ");
            if (tk != undefined) {
                this.traduccion += ")";
            }
            return;
        }
        tk = this.VALOR();
        if (tk != undefined) {
            this.traduccion += tk.lexema;
        }
    };
    Parser.prototype.VALOR = function () {
        var tk = this.preanalisis;
        var tp = tk.tipo;
        switch (tp) {
            case lexpython_1.Tipo.cadena:
                tk = this.Match(lexpython_1.Tipo.cadena, "Se esperaba una cadena ");
                break;
            case lexpython_1.Tipo.caracter:
                tk = this.Match(lexpython_1.Tipo.caracter, "Se esperaba un caracter ");
                break;
            case lexpython_1.Tipo.entero:
                tk = this.Match(lexpython_1.Tipo.entero, "Se esperaba un numero entero");
                break;
            case lexpython_1.Tipo.double:
                tk = this.Match(lexpython_1.Tipo.double, "Se esperaba un numero decimal ");
                break;
            case lexpython_1.Tipo.rtrue:
                tk = this.Match(lexpython_1.Tipo.rtrue, "Se esperaba un valor booleano ");
                break;
            case lexpython_1.Tipo.rfalse:
                tk = this.Match(lexpython_1.Tipo.rfalse, "Se esperaba un valor booleano ");
                break;
            default:
                this.Errores_("Se esperaba un valor string,char,int,double o boolean y se obtuvo " + tk.lexema, tk.fila, tk.columna);
                this.Panico();
                return undefined;
        }
        return tk;
    };
    return Parser;
}());
var parser = new Parser();
exports.default = parser;
