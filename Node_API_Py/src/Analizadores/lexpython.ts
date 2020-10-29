class Token{
    lexema:string;
    tipo:Tipo;
    fila:number; 
    columna:number;
    constructor(lexema:string,tipo:Tipo,fila:number,columna:number){
        this.lexema=lexema;
        this.tipo=tipo;
        this.fila=fila;
        this.columna=columna;
    }    
}

class Error{
    tipo:TipoErr;
    fila:number;
    columna:number;
    descripcion:string
    constructor(tipo:TipoErr,fila:number,columna:number,descripcion:string){
        this.tipo=tipo;
        this.fila=fila;
        this.columna=columna;
        this.descripcion=descripcion;
    }
}

enum TipoErr{
    lexico,
    sintactico,
}
enum Tipo{
    id=1, 
    entero,
    double,
    cadena,
    caracter,
    comentarioSimple,
    comentarioMulti,
    or,
    and,
    xor,
    not,
    mas,
    masmas,
    menosmenos,
    division,
    por,
    menos,
    mayor,
    menor,
    igual,
    diferente,
    punto,
    puntoycoma,
    coma,
    parizq,
    parder,
    corizq,
    corder,
    llaveizq,
    llaveder,
    rclass,
    rvoid,
    rif,
    rwhile,
    rdo,
    relse,
    rsystem,
    rout,
    rprint,
    rprintln,
    rtrue,
    rfalse,
    rfor,
    rpublic,
    args,
    rprivate,
    rprotected,
    rint,
    rchar,
    rstring,
    rdouble,
    rboolean,
    rbreak,
    rreturn,
    rcontinue,
    rstatic,
    rmain,
    rinterface,
    dolar,

}

class Scanner{
    tokens:Token[];
    errores:Error[];
    depurado:string;
    constructor(){
        this.errores=[];
        this.tokens=[];
        this.depurado="";        
    }
    ejecutar(doc:string) {
    var estado:number=0;
    var lexema:string="";
    this.tokens=[];
    this.errores=[];
    var fila:number=1,columna:number=1;
    this.depurado="";
    for (let i = 0; i < doc.length; i++) {
        var c= doc[i];
        switch(estado){
            case 0:
                if((/[a-zA-Z]/).test(c)){
                    estado=1;
                    lexema+=c;
                }else if((/[0-9]/).test(c)){
                    estado=2;
                    lexema+=c;
                }else if(c==' ' || c=='\r' || c=='\b' || c=='\t'){
                    estado=0;
                    continue;
                }else if(c=='\n'){
                    fila++;
                    columna=1;
                }else{
                    switch(c){                        
                        case '"':
                            lexema+=c;
                            estado=11;
                            break;
                        case '/':
                            lexema+=c;
                            estado=5;
                            break;
                        case '-':
                            lexema+=c;
                            estado=15;
                            break;
                        case '+':
                            lexema+=c;
                            estado=13;
                            break;
                        case '&':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.and,fila,columna));
                            lexema="";
                            break;
                        case '*':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.por,fila,columna));
                            lexema="";
                            break;
                        case '|':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.or,fila,columna));
                            lexema="";
                            break;
                        case '^':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.xor,fila,columna));
                            lexema="";
                            break;
                        case '=':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.igual,fila,columna));
                            lexema="";
                            break;
                        case '<':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.menor,fila,columna));
                            lexema="";
                            break;
                        case '>':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.mayor,fila,columna));
                            lexema="";
                            break;
                        case '!':
                            lexema+=c;
                            estado=7;
                            break;
                        case ';':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.puntoycoma,fila,columna));
                            lexema="";
                            break;
                        case '.':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.punto,fila,columna));
                            lexema="";
                            break;
                        case '(':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.parizq,fila,columna));
                            lexema="";
                            break;
                        case ')':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.parder,fila,columna));
                            lexema="";
                            break;
                        case '{':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.llaveizq,fila,columna));
                            lexema="";
                            break;
                        case '}':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.llaveder,fila,columna));
                            lexema="";
                            break;
                        case '[':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.corizq,fila,columna));
                            lexema="";
                            break;
                        case ']':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.corder,fila,columna));
                            lexema="";
                            break;
                        case ',':
                            lexema+=c;
                            this.tokens.push(new Token(lexema,Tipo.coma,fila,columna));
                            lexema="";
                            break;
                        case '\'':
                            lexema+=c;
                            estado=17;
                            break;
                        default:
                            this.errores.push(new Error(TipoErr.lexico,fila,columna,`El caracter '${c}' no pertenece al lenguaje`));
                            estado=0;
                            lexema="";
                            continue;
                    }
                }
                break;
            case 1://se aceptan los ids
                if(!(/[a-zA-Z0-9]/).test(c) && c!='_'){
                    this.tokens.push(new Token(lexema,this.reservadas(lexema),fila,columna));
                    lexema="";
                    estado=0;
                    i--;
                    continue;
                }
                lexema+=c;
                break;
            case 2:
                if((/[0-9]/).test(c)){
                    lexema+=c;
                }else if(c=='.'){
                    lexema+=c;
                    estado=3;
                }else{
                    this.tokens.push(new Token(lexema,Tipo.entero,fila,columna));
                    lexema="";
                    estado=0;
                    i--;
                }
                break;
            case 3:
                if((/[0-9]/).test(c)){
                    lexema+=c;
                    estado=4;
                }
                break;
            case 4:
                if(!(/[0-9]/).test(c)){
                    this.tokens.push(new Token(lexema,Tipo.double,fila,columna));
                    lexema="";
                    estado=0;
                    i--;
                }
                lexema+=c;
                break;
            case 5:
                if(c=='*'){
                    lexema+=c;
                    estado=8;
                }else if(c=='/'){
                    lexema+=c;
                    estado=6;
                }else{
                    //se acepta el simbolo de division
                    this.tokens.push(new Token(lexema,Tipo.division,fila,columna));
                    lexema="";
                    estado=0;
                    i--;
                }
                break;
            case 6:
                if(c=='\n'){
                    this.tokens.push(new Token(lexema,Tipo.comentarioSimple,fila,columna));
                    lexema="";
                    estado=0;
                    fila++;
                    columna=1;
                    continue;
                }
                lexema+=c;
                
                break;
            case 7:
                if(c=='='){
                    lexema+=c;
                    this.tokens.push(new Token(lexema,Tipo.diferente,fila,columna));
                    lexema="";
                    estado=0;
                    continue;
                }
                this.tokens.push(new Token(lexema,Tipo.not,fila,columna));
                lexema="";
                estado=0;
                i--;
                break;
            case 8:
                lexema+=c;
                if(c=='*'){
                    estado=9;
                }else if(c=='\n'){
                    fila++;
                    columna=1;
                }
                break;
            case 9:
                lexema+=c;
                if(c=='/'){//se acepta el comentario multilinea
                    this.tokens.push(new Token(lexema,Tipo.comentarioMulti,fila,columna));
                    lexema="";
                    estado=0;
                    continue;
                }else if(c=='\n'){
                    fila++;
                    columna=1;
                }
                estado=8;
                
                break;
                
            case 11:
                lexema+=c;
                if(c=='"'){
                    this.tokens.push(new Token(lexema,Tipo.cadena,fila,columna));
                    lexema="";
                    estado=0;
                }else if(c=='\n'){
                    fila++;
                    columna=1;
                }
                break;
            case 13:
                var tipo:Tipo;
                if(c=='+'){
                    lexema+=c;
                    tipo=Tipo.masmas;
                }else{
                    tipo=Tipo.mas;
                    i--;
                }
                this.tokens.push(new Token(lexema,tipo,fila,columna));
                lexema="";
                estado=0;
                break;
            case 15:
                var tipo:Tipo;
                if(c=='-'){
                    lexema+=c;
                    tipo=Tipo.menosmenos;
                }else{
                    tipo=Tipo.menos;
                    i--;
                }
                this.tokens.push(new Token(lexema,tipo,fila,columna));
                lexema="";
                estado=0;
                break;
            case 17:
                lexema+=c;
                estado=18;
                break;
            case 18:
                lexema+=c;
                if(c=='\''){//se acepta caracter
                    this.tokens.push(new Token(lexema,Tipo.caracter,fila,columna));
                    lexema="";
                    estado=0;
                }
                break;
        }
        columna++;
        this.depurado+=c;
        
    }    
    }
    reservadas(lexema:string):Tipo{
        var lex=lexema.toLowerCase();
        switch(lex){
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
    }
}
const scanner=new Scanner();
export{
    Scanner,
    Tipo,
    TipoErr,
    Error,
    Token,
    scanner,    
};