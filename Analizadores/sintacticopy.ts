import {Scanner,Token,Error,Tipo,TipoErr} from './lexpython';

class Parser{
    tokens:Token[];
    errores:Error[];
    preanalisis:any;
    i:number=0;
    constructor(){
        this.tokens=[];
        this.errores=[];
        this.preanalisis=null;
    }
    ejecutar(Scan:Scanner){        
        this.tokens=Scan.tokens;
        this.errores=Scan.errores;
        this.preanalisis=this.tokens[this.i];
        this.tokens.push(new Token('$',Tipo.dolar,0,0));//se agrega un simbolo final para asegurarnos que no se pase del limite
        //aqui comienza el analisis
        this.INICIO();
        this.preanalisis=null;
        this.i=0;
    }
    getNext(){
        if(this.i<this.tokens.length){
            this.i++;
            this.preanalisis=this.tokens[this.i];
        }
    }
    Match(tk_tipo:Tipo,descripcion:string):Token|undefined{
        //se encarga de identificar los tokens y verificar que coincidan
        var tipo:Tipo=this.preanalisis.tipo
            if(tk_tipo==tipo){            
                var tk:Token=this.preanalisis;
                this.getNext();                
                return tk;
            }
            this.Errores_(descripcion+"y se obtuvo "+this.preanalisis.lexema,this.preanalisis.fila,this.preanalisis.columna);
            this.Panico();
        
    }
    Errores_(descripcion:string,fila:number,columna:number){
        //guarda los errores sintacticos encontrados en la entrada
        this.errores.push(new Error(TipoErr.sintactico,fila,columna,descripcion));
    }
    Panico(){
        //se encarga de la recuperación del analisis
        this.getNext();//vamos verificando hasta que encontremos un ;
        var tipo=this.preanalisis.tipo;
        while(!(tipo==Tipo.puntoycoma || tipo==Tipo.parder || tipo==Tipo.llaveder)){
            this.getNext();
            tipo=this.preanalisis.tipo;
        }
        //salió del ciclo, por lo cual encontro un ; ó ) ó }
        this.getNext();//nos movemos al siguiente
    }
    INICIO(){
        this.CLASES();
    }
    CLASES(){
        if(this.preanalisis.tipo==Tipo.dolar){
            return;
        }
        this.CLASE();
        this.CLASES();
        
    }
    CLASE(){
        this.Match(Tipo.rpublic,"Se esperaba la palabra Reservada 'public' ");
        this.TCLASS();
        this.Match(Tipo.id,"Se esperaba un id ")
        this.BLOQUEC();
    }
    TCLASS(){
        var tipo=this.preanalisis.tipo;
        if(tipo==Tipo.rclass){
            this.Match(Tipo.rclass,"Se esperaba la palabra reservada 'Class' ");
        }else if(tipo==Tipo.rinterface){
            this.Match(Tipo.rinterface,"Se esperaba la palabra reservada 'Interface' ");
        }
    }
    BLOQUEC(){
        this.Match(Tipo.llaveizq,"Se esperaba '{' ");
        this.INSTCLASE();
        this.Match(Tipo.llaveder,"Se esperaba '}' ");
    }
    INSTCLASE(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.rpublic){
            this.Match(Tipo.rpublic,"Se esperaba la palabra Reservada 'public' ");
            this.FUNMET();
            return;
        }else if(tp==Tipo.rint || tp==Tipo.rstring || tp==Tipo.rdouble || tp==Tipo.rchar || tp==Tipo.rboolean){
            this.T();
            this.DECLARACION();
        }
    }
    FUNMET(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.rstatic){
            this.Match(Tipo.rstatic,"Se esperaba la palabra reservada 'static' ");
            this.Match(Tipo.rvoid,"Se esperaba la palabra reservada 'void' ");
            this.Match(Tipo.rmain,"Se esperaba la palabra reservada 'main' ");
            this.Match(Tipo.parizq,"Se esperaba el simbolo '(' ");
            this.Match(Tipo.rstring,"Se esperaba la palabra reservada 'String' ");
            this.Match(Tipo.corizq,"Se esperaba el simbolo '[' ");
            this.Match(Tipo.corder,"Se esperaba el simbolo ']' ");
            this.Match(Tipo.args,"Se esperaba la palabra reservada 'args' ");
            this.Match(Tipo.parder,"Se esperaba el simbolo ')' ");
            this.BLOQUEI();
            return;
        }
        this.T_FM();
        this.Match(Tipo.id,"Se esperaba un id ");
        this.Match(Tipo.parizq,"Se esperaba el simbolo '(' ");
        this.T();
        this.Match(Tipo.id,"Se esperaba un id ");
        this.PARAMETROS();
        this.Match(Tipo.parder,"Se esperaba el simbolo ')' ");
        this.T_IC();
    }
    PARAMETROS(){
        const tp:Tipo=this.preanalisis;
        if(tp==Tipo.coma){
            this.Match(Tipo.coma,"Se esperaba una ',' ");
            this.T();
            this.Match(Tipo.id,"Se esperaba un id ");
            this.PARAMETROS();
        }
    }
    T_IC(){
        const tp:Tipo=this.preanalisis;
        if(tp==Tipo.puntoycoma){
            this.Match(Tipo.puntoycoma,"Se esperaba un ';' ");
            return;
        }
        this.BLOQUEI();
    }
    T_FM(){
        const tp:Tipo=this.preanalisis;
        if(tp==Tipo.rvoid){
            this.Match(Tipo.rvoid,"Se esperaba la palabra reservada 'void' ");
            return;
        }
        this.T();
    }
    DECLARACION(){
        this.Match(Tipo.id,"Se esperaba un id ");
        this.ASIGNACION();
        this.VAL2();
    }
    ASIGNACION(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.igual){
            this.Match(Tipo.igual,"Se esperaba '=' ");
            this.EXP();
        }
    }
    VAL2(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.coma){
            this.Match(Tipo.coma,"Se esperaba ',' ");
            this.Match(Tipo.id,"Se esperaba un id ");
            this.ASIGNACION();
            this.VAL2();
        }
    }
    T(){
        var tk:Token=this.preanalisis;
        const tp=tk.tipo;
        switch(tp){
            case Tipo.rint:
                this.Match(tp,"Se esperaba la palabra reservada 'int' ");
                break;
            case Tipo.rdouble:
                this.Match(tp,"Se esperaba la palabra reservada 'double' ");
                break;
            case Tipo.rstring:
                this.Match(tp,"Se esperaba la palabra reservada 'string' ");
                break;
            case Tipo.rboolean:
                this.Match(tp,"Se esperaba la palabra reservada 'boolean' ");
                break;
            case Tipo.rchar:
                this.Match(tp,"Se esperaba la palabra reservada 'char' ");
                break;
            default:
                this.Errores_("Se esperaba 'string','char','int','double' o 'boolean';\nen su lugar vino "+tk.lexema,tk.fila,tk.columna);
                this.Panico();
                break;
        }
    }
    BLOQUEI(){
        this.Match(Tipo.llaveizq,"Se esperaba una '{' ");
        this.INSTRUCCIONES();
        this.Match(Tipo.llaveder,"Se esperaba '}' ");
    }
    INSTRUCCIONES(){//revisar por recursividad infinita
        this.INSTRUCCION();
        this.INSTRUCCIONES();
    }
    INSTRUCCION(){
        const tp:Tipo=this.preanalisis.tipo;
        switch(tp){
            case Tipo.rfor:
                this.Match(Tipo.rfor,"Se esperaba la palabra reservada 'for' ");
                this.FOR_();
                break;
            case Tipo.rwhile:
                this.Match(Tipo.rwhile,"Se esperaba la palabra reservada 'while' ");
                this.WHILE_();
                break;
            case Tipo.rdo:
                this.Match(Tipo.rdo,"Se esperaba la palabra reservada 'do' ");
                this.DOWHILE_();
                break;
            case Tipo.rif:
                this.Match(Tipo.rif,"Se esperaba la palabra reservada 'if' ");
                this.IF_();
                break;
            case Tipo.rbreak:
                this.Match(Tipo.rbreak,"Se esperaba la palabra reservada 'break' ");
                this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
                break;
            case Tipo.rcontinue:
                this.Match(Tipo.rcontinue,"Se esperaba la palabra reservada 'continue' ");
                this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
                break;
            case Tipo.rreturn:
                this.Match(Tipo.rreturn,"Se esperaba la palabra reservada 'return' ");
                this.EXP();
                this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
                break;
            case Tipo.rsystem:
                this.Match(Tipo.rsystem,"Se esperaba la palabra reservada 'system' ");
                this.IMPRIMIR();
                this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
                break;
            case Tipo.id:
                this.Match(Tipo.id,"Se esperaba un id ");
                this.ASIG_LLAMA();
                this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
                break;
            default:
                this.T();
                this.DECLARACION();
                this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
                break;
        }
    }
    ASIG_LLAMA(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.igual){
            this.Match(Tipo.igual,"Se esperaba '=' ");
            this.EXP();
            return;
        }
        this.Match(Tipo.parizq,"Se esperaba '(' ");
        this.EXP();
        this.VALORES();
        this.Match(Tipo.parder,"Se esperaba ')' ");
    }
    VALORES(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.coma){
            this.Match(Tipo.coma,"Se esperaba ',' ");
            this.EXP();
            this.VALORES();
        }
    }
    IMPRIMIR(){
        this.Match(Tipo.punto,"Se esperaba un '.' ");
        this.Match(Tipo.rout,"Se esperaba la palabra reservada 'out' ");
        this.Match(Tipo.punto,"Se esperaba un '.' ");
        this.IMPRIMIR_1();
        this.Match(Tipo.parizq,"Se esperaba un '(' ");
        this.EXP();
        this.Match(Tipo.parder,"Se esperaba ')' ");
    }
    IMPRIMIR_1(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.rprint){
            this.Match(Tipo.rprint,"Se esperaba la palabra reservada 'print' ");
            return;
        }
        this.Match(Tipo.rprintln,"Se esperaba la palabra reservada 'println' ");
        
    }
    IF_(){
        this.Match(Tipo.parizq,"Se esperaba '(' ");
        this.EXP();
        this.Match(Tipo.parder,"Se esperaba ')' ");
        this.BLOQUEI();
        this.ELSE_();
    }
    ELSE_(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.relse){
            this.Match(Tipo.relse,"Se esperaba la palabra reservada 'else' ");
            this.ELSE_1();
        }
    }
    ELSE_1(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.rif){
            this.Match(Tipo.rif,"Se esperaba la palabra reservada 'if' ");
            this.IF_();
            return;
        }
        this.BLOQUEI();
    }
    DOWHILE_(){
        this.BLOQUEI();
        this.Match(Tipo.rwhile,"Se esperaba la palabra reservada 'while' ");
        this.Match(Tipo.parizq,"Se esperaba '(' ");
        this.EXP();
        this.Match(Tipo.parder,"Se esperaba ')' ");
        this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
    }
    WHILE_(){
        this.Match(Tipo.parizq,"Se esperaba '(' ");
        this.EXP();
        this.Match(Tipo.parder,"Se esperaba ')' ");
        this.BLOQUEI();
    }
    FOR_(){
        this.Match(Tipo.parizq,"Se esperaba '(' ");
        this.T();
        this.Match(Tipo.id,"Se esperaba un id ");
        this.Match(Tipo.igual,"Se esperaba '=' ");
        this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
        this.EXP();
        this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
        this.EXP();
        this.Match(Tipo.parder,"Se esperaba ')' ");
        this.BLOQUEI();
    }
    EXP(){
        this.A();
    }
    A(){
        this.B();
        this.A_1();
    }    
    A_1(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.or){
            this.Match(Tipo.or,"Se esperaba '|' ");
            this.Match(Tipo.or,"Se esperaba '|' ");
            this.B();
            this.A_1();
        }
    }
    B(){
        this.C();
        this.B_1();
    }
    B_1(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.xor){
            this.Match(Tipo.xor,"Se esperaba '^' ");
            this.C();
            this.B_1();
        }
    }
    C(){
        this.D();
        this.C_1();
    }
    C_1(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.and){
            this.Match(Tipo.and,"Se esperaba '&' ");
            this.Match(Tipo.and,"Se esperaba '&' ");
            this.D();
            this.C_1();
        }
    }
    D(){
        this.E();
        this.D_1();
    }
    D_1(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.igual){
            this.Match(Tipo.igual,"Se esperaba '=' ");
            this.Match(Tipo.igual,"Se esperaba '=' ");
            this.E();
            this.D_1();
        }
    }
    E(){
        this.F();
        this.E_1();
    }
    E_1(){
        const tp:Tipo=this.preanalisis.tipo;
        switch(tp){
            case Tipo.menor:
                this.Match(Tipo.menor,"Se esperaba '<' ");
                this.E_2();
                break;
            case Tipo.mayor:
                this.Match(Tipo.mayor,"Se esperaba '>' ");
                this.E_2();
                break;
        }
    }

    E_2(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.igual){
            this.Match(Tipo.igual,"Se esperaba '=' ");
            this.F();
            this.E_1();
            return;
        }
        this.F();
        this.E_1();
    }

    F(){
        this.G();
        this.F_1();
    }
    F_1(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.mas){
            this.Match(Tipo.mas,"Se esperaba '+' ");
            this.G();
            this.F_1();
        }else if(tp==Tipo.menos){
            this.Match(Tipo.menos,"Se esperaba '-' ");
            this.G();
            this.F_1();
        }
    }
    G(){
        this.H();
        this.G_1();
    }
    G_1(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.por){
            this.Match(Tipo.por,"Se esperaba '*' ");
            this.H();
            this.G_1();
        }else if(tp==Tipo.division){
            this.Match(Tipo.division,"Se esperaba '/' ");
            this.H();
            this.G_1();
        }
    }
    H(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.id){
            this.Match(Tipo.id,"Se esperaba un id ");
            this.J();
            return;
        }
        this.K();
    }
    J(){
        const tp:Tipo=this.preanalisis.tipo;
        switch(tp){
            case Tipo.masmas:
                this.Match(Tipo.masmas,"Se esperaba '++' ");
                break;
            case Tipo.menosmenos:
                this.Match(Tipo.menosmenos,"Se esperaba '--' ");
                break;
            case Tipo.parizq:
                this.Match(Tipo.parizq,"Se esperaba '(' ");
                this.VALORES();
                this.Match(Tipo.parder,"Se esperaba ')' ");
                break;
        }
    }
    K(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.parder){
            this.Match(Tipo.parizq,"Se esperaba '(' ");
            this.A();
            this.Match(Tipo.parder,"Se esperaba ')' ");
            return;
        }
        this.VALOR();
    }
    VALOR(){
        const tk:Token=this.preanalisis;
        const tp:Tipo=tk.tipo;
        switch(tp){
            case Tipo.cadena:
                this.Match(Tipo.cadena,"Se esperaba una cadena ");
                break;
            case Tipo.caracter:
                this.Match(Tipo.caracter,"Se esperaba un caracter ");
                break;
            case Tipo.entero:
                this.Match(Tipo.entero,"Se esperaba un numero entero");
                break;
            case Tipo.double:
                this.Match(Tipo.double,"Se esperaba un numero decimal ");
                break;
            case Tipo.rtrue:
                this.Match(Tipo.rtrue,"Se esperaba un valor booleano ");
                break;
            case Tipo.rfalse:
                this.Match(Tipo.rfalse,"Se esperaba un valor booleano ");
                break;
            default:
                this.Errores_("Se esperaba un valor string,char,int,double o boolean y se obtuvo "+tk.lexema,tk.fila,tk.columna)
                this.Panico();
                break;
        }
    }

}

export{Parser}