import {Scanner,Token,Error,Tipo,TipoErr} from './lexpython';

class Parser{
    tokens:Token[];
    errores:Error[];
    preanalisis:Token;
    traduccion:string;
    tabs:string;
    i:number=0;
    constructor(){
        this.tokens=[];
        this.errores=[];
        this.preanalisis=new Token("",Tipo.dolar,0,0);
        this.traduccion="";
        this.tabs="";
    }
    ejecutar(Scan:Scanner){       
        this.tokens=Scan.tokens;
        this.errores=Scan.errores;
        this.traduccion="";
        this.tabs="";
        this.preanalisis=this.tokens[this.i];
        this.tokens.push(new Token('$',Tipo.dolar,0,0));//se agrega un simbolo final para asegurarnos que no se pase del limite
        //aqui comienza el analisis
        this.INICIO();
        this.i=0;
        this.tabs="";
        return {Tokens:this.tokens,Errores:this.errores,Traduccion:this.traduccion}
    }
    getNext(){
        if(this.i<this.tokens.length){
            this.i++;
            if(this.tokens[this.i]==undefined){
                return;
            }
            this.preanalisis=this.tokens[this.i];
        }
    }
    Match(tk_tipo:Tipo,descripcion:string):Token | undefined{
        //se encarga de identificar los tokens y verificar que coincidan
        var tk:Token=this.preanalisis;
        var tipo:Tipo=tk.tipo;
            if(tk_tipo==tipo){      
                this.getNext();                
                return tk;
            }
            if(tipo==Tipo.comentarioSimple){
                //se traduce el comentario                
                this.traduccion+="\n"+this.tabs+"#"+tk.lexema.substring(2,tk.lexema.length);
                //se pasa al siguiente token
                this.getNext();
                var val=this.Match(tk_tipo,descripcion);
                return val;
            }
            if(tipo==Tipo.comentarioMulti){
                //comentario multiple
                this.traduccion+="\n"+this.tabs+"'''"+tk.lexema.substring(2,tk.lexema.length-3)+"'''\n";
                this.getNext();
                var val=this.Match(tk_tipo,descripcion);
                return val;   
            }
            this.Errores_(descripcion+"y se obtuvo "+this.preanalisis.lexema,this.preanalisis.fila,this.preanalisis.columna);
            this.Panico();
            return undefined;
        
    }
    Errores_(descripcion:string,fila:number,columna:number){
        //guarda los errores sintacticos encontrados en la entrada
        this.errores.push(new Error(TipoErr.sintactico,fila,columna,descripcion));
        console.log("Error Sintactico:"+descripcion+", Fila:"+String(fila)+", Columna:"+String(columna));
    }
    Panico(){
        //se encarga de la recuperación del analisis
        this.getNext();//vamos verificando hasta que encontremos un ;
        if(this.preanalisis==undefined){
            return;
        }        
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
        var tk:Token|undefined;
        this.Match(Tipo.rpublic,"Se esperaba la palabra Reservada 'public' ");
        var val=this.TCLASS();
        
        tk=this.Match(Tipo.id,"Se esperaba un id ")
            if(tk!=undefined ){
                this.tabs+="\t";
                this.traduccion+=tk.lexema;
            }
            this.BLOQUEC();
            //elimina un tab
            this.UnTabMenos();
    }
    UnTabMenos(){
        if(this.tabs.length==0){
            return;
        }
        this.tabs=this.tabs.substring(0,this.tabs.length-1);
    }
    TCLASS(){
        var tk:Token|undefined;
        var tipo=this.preanalisis.tipo;
        if(tipo==Tipo.rclass){
            tk=this.Match(Tipo.rclass,"Se esperaba la palabra reservada 'Class' ");
            this.traduccion+="\nclass ";
            return "class";
        }else if(tipo==Tipo.rinterface){
            tk=this.Match(Tipo.rinterface,"Se esperaba la palabra reservada 'Interface' ");
            return "interface";
        }
    }
    BLOQUEC(){
        var tk:Token|undefined;
        tk=this.Match(Tipo.llaveizq,"Se esperaba '{' ");
        if(tk!=undefined){
            this.traduccion+=":\n";
        }
        this.INSTCLASE();
        tk=this.Match(Tipo.llaveder,"Se esperaba '}' ");
        if(tk!=undefined){
            this.UnTabMenos();
        }
    }
    INSTCLASE(){
        var tk:Token|undefined=this.preanalisis;
        const tp:Tipo=tk.tipo;
        if(tp==Tipo.rpublic){
            this.Match(Tipo.rpublic,"Se esperaba la palabra Reservada 'public' ");
            this.FUNMET();
            this.INSTCLASE();
            return;
        }else if(tp==Tipo.rint || tp==Tipo.rstring || tp==Tipo.rdouble || tp==Tipo.rchar || tp==Tipo.rboolean){
            tk=this.T();
            this.DECLARACION();
            tk=this.Match(Tipo.puntoycoma,"Se esperaba un ';' ");
            this.INSTCLASE();
        }else if(tp==Tipo.comentarioMulti){
            //comentario multiple
            this.traduccion+="\n"+this.tabs+"'''"+tk.lexema.substring(2,tk.lexema.length-2)+"'''\n";
            this.getNext();
        }else if(tp==Tipo.comentarioSimple){
            //se traduce el comentario                
            this.traduccion+="\n"+this.tabs+"#"+tk.lexema.substring(2,tk.lexema.length);
            //se pasa al siguiente token
            this.getNext();
        }
        
    }
    FUNMET(){
        var tk:Token|undefined;
        var tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.rstatic){
            this.Match(Tipo.rstatic,"Se esperaba la palabra reservada 'static' ");
            this.Match(Tipo.rvoid,"Se esperaba la palabra reservada 'void' ");
            tk=this.Match(Tipo.rmain,"Se esperaba la palabra reservada 'main' ");
            if(tk!=undefined){
                this.traduccion+="\n"+this.tabs+"def main()";

            }
            this.Match(Tipo.parizq,"Se esperaba el simbolo '(' ");
            this.Match(Tipo.rstring,"Se esperaba la palabra reservada 'String' ");
            this.Match(Tipo.corizq,"Se esperaba el simbolo '[' ");
            this.Match(Tipo.corder,"Se esperaba el simbolo ']' ");
            this.Match(Tipo.args,"Se esperaba la palabra reservada 'args' ");
            this.Match(Tipo.parder,"Se esperaba el simbolo ')' ");
            this.BLOQUEI();
            this.traduccion+="\n"+this.tabs+"if__name__=\"__main__\":";
            this.traduccion+="\n\t"+this.tabs+"main()";
            return;
        }//buscar error por las funciones metodos
        tk=this.T_FM();
        if(tk!=undefined){
            this.traduccion+="\n"+this.tabs+" self ";
        }
        tk=this.Match(Tipo.id,"Se esperaba un id ");
        if(tk!=undefined){
            this.traduccion+=tk.lexema;
        }
        tk=this.Match(Tipo.parizq,"Se esperaba el simbolo '(' ");
        if(tk!=undefined){
            this.traduccion+="(";
        }
        
        this.PARM1();
        
        tk=this.Match(Tipo.parder,"Se esperaba el simbolo ')' ");
        if(tk!=undefined){
            this.traduccion+=")";
        }
        this.T_IC();
    }
    PARM1(){
        var tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.rint || tp==Tipo.rboolean || tp==Tipo.rstring || tp==Tipo.rchar || tp==Tipo.rdouble){
            this.T();
            var tk=this.Match(Tipo.id,"Se esperaba un id ");
            if(tk!=undefined){
                this.traduccion+=tk.lexema;
            }
            this.PARAMETROS();
        }
    }
    PARAMETROS(){
        var tk:Token|undefined=this.preanalisis;
        var tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.coma){
            this.Match(Tipo.coma,"Se esperaba una ',' ");
            this.traduccion+=", ";
            tk=this.T();            
            tk=this.Match(Tipo.id,"Se esperaba un id ");
            if(tk!=undefined){
                this.traduccion+=tk.lexema;
            }
            this.PARAMETROS();
        }
    }
    T_IC(){
        var tp:Tipo=this.preanalisis.tipo;
        
        if(tp==Tipo.puntoycoma){
            this.Match(Tipo.puntoycoma,"Se esperaba un ';' ");
            this.traduccion+=";";
            return;
        }
        this.BLOQUEI();        
    }
    T_FM(){
        var tk:Token|undefined=this.preanalisis;
        var tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.rvoid){
            tk=this.Match(Tipo.rvoid,"Se esperaba la palabra reservada 'void' ");
        }else{
            tk=this.T();
        }
        return tk;
    }
    DECLARACION(){
        var tk:Token|undefined=this.Match(Tipo.id,"Se esperaba un id ");
        if(tk!=undefined){
            this.traduccion+="\n"+this.tabs+tk.lexema;
        }
        this.ASIGNACION();
        this.VAL2();
    }
    ASIGNACION(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.igual){
            this.Match(Tipo.igual,"Se esperaba '=' ");
            this.traduccion+="=";
            this.EXP();
        }
    }
    VAL2(){
        var tk:Token|undefined;
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.coma){
            tk=this.Match(Tipo.coma,"Se esperaba ',' ");
            if(tk!=undefined){
                this.traduccion+=", ";
            }
            tk=this.Match(Tipo.id,"Se esperaba un id ");
            if(tk!=undefined){
                this.traduccion+=tk.lexema;
            }
            this.ASIGNACION();
            this.VAL2();
        }
    }
    T():Token | undefined{
        var tk:Token|undefined=this.preanalisis;
        const tp=tk.tipo;
        switch(tp){
            case Tipo.rint:
                tk=this.Match(tp,"Se esperaba la palabra reservada 'int' ");
                break;
            case Tipo.rdouble:
                tk=this.Match(tp,"Se esperaba la palabra reservada 'double' ");
                break;
            case Tipo.rstring:
                tk=this.Match(tp,"Se esperaba la palabra reservada 'string' ");
                break;
            case Tipo.rboolean:
                tk=this.Match(tp,"Se esperaba la palabra reservada 'boolean' ");
                break;
            case Tipo.rchar:
                tk=this.Match(tp,"Se esperaba la palabra reservada 'char' ");
                break;
            default:
                this.Errores_("Se esperaba 'string','char','int','double' o 'boolean';\nen su lugar vino "+tk.lexema,tk.fila,tk.columna);
                this.Panico();
                return undefined;
        }
        return tk;
    }
    BLOQUEI(){
        var tk:Token|undefined;
        tk=this.Match(Tipo.llaveizq,"Se esperaba una '{' ");
        if(tk!=undefined){
            this.traduccion+=":";
            this.tabs+="\t";
        }
        this.INSTRUCCIONES();
        tk=this.Match(Tipo.llaveder,"Se esperaba '}' ");
        if(tk!=undefined){
            this.UnTabMenos();
        }
    }
    INSTRUCCIONES(){//revisar por recursividad infinita
        if(this.preanalisis.tipo==Tipo.llaveder){
            return;
        }
        this.INSTRUCCION();
        this.INSTRUCCIONES();

    }
    INSTRUCCION(){
        var tk:Token|undefined=this.preanalisis;
        const tp:Tipo=this.preanalisis.tipo;
        switch(tp){
            case Tipo.rfor:
                tk=this.Match(Tipo.rfor,"Se esperaba la palabra reservada 'for' ");
                if(tk!=undefined){
                    this.traduccion+="\n"+this.tabs+tk.lexema+" ";
                }
                this.FOR_();
                break;
            case Tipo.rwhile:
                tk=this.Match(Tipo.rwhile,"Se esperaba la palabra reservada 'while' ");
                if(tk!=undefined){
                    this.traduccion+="\n"+this.tabs+tk.lexema+" ";
                }
                this.WHILE_();
                break;
            case Tipo.rdo:
                tk=this.Match(Tipo.rdo,"Se esperaba la palabra reservada 'do' ");
                if(tk!=undefined){
                    this.tabs+="\t";
                    this.traduccion+="\n"+this.tabs+"while True";
                }
                this.DOWHILE_();
                this.UnTabMenos();
                break;
            case Tipo.rif:
                tk=this.Match(Tipo.rif,"Se esperaba la palabra reservada 'if' ");
                if(tk!=undefined){
                    this.traduccion+="\n"+this.tabs;
                }
                this.IF_();
                break;
            case Tipo.rbreak:
                this.Match(Tipo.rbreak,"Se esperaba la palabra reservada 'break' ");
                this.traduccion+="\n"+this.tabs+"break\n";
                this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
                break;
            case Tipo.rcontinue:
                this.Match(Tipo.rcontinue,"Se esperaba la palabra reservada 'continue' ");
                this.traduccion+="\n"+this.tabs+"continue\n";
                this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
                break;
            case Tipo.rreturn:
                this.Match(Tipo.rreturn,"Se esperaba la palabra reservada 'return' ");
                this.traduccion+="\n"+this.tabs+"return ";
                this.EXP();
                this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
                break;
            case Tipo.rsystem:
                this.Match(Tipo.rsystem,"Se esperaba la palabra reservada 'system' ");
                this.traduccion+="\n"+this.tabs;
                this.IMPRIMIR();
                this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
                break;
            case Tipo.id:
                this.Match(Tipo.id,"Se esperaba un id ");
                this.traduccion+="\n"+this.tabs+tk.lexema+" ";
                this.ASIG_LLAMA();
                tk=this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
                break;            
            case Tipo.comentarioMulti:
                    //comentario multiple
                    this.traduccion+="\n"+this.tabs+"'''"+tk.lexema.substring(2,tk.lexema.length-2)+"'''\n";
                    this.getNext();
                break;
            case Tipo.comentarioSimple:
                    //se traduce el comentario                
                    this.traduccion+="\n"+this.tabs+"#"+tk.lexema.substring(2,tk.lexema.length);
                    //se pasa al siguiente token
                    this.getNext();
                break;
            default:
                tk=this.T();
                this.DECLARACION();                
                this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
                break;
        }
    }
    ASIG_LLAMA(){
        var tk:Token|undefined;
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.igual){
            tk=this.Match(Tipo.igual,"Se esperaba '=' ");
            if(tk!=undefined){
                this.traduccion+=" = ";
            }
            this.EXP();
            return;
        }else if(tp==Tipo.masmas){
            tk=this.Match(Tipo.masmas,"Se esperaba '++' ");
            if(tk!=undefined){
                this.traduccion+=" += 1 ";
            }
            return;
        }else if(tp==Tipo.menosmenos){
            tk=this.Match(Tipo.menosmenos,"Se esperaba '--' ");
            if(tk!=undefined){
                this.traduccion+=" -= 1 ";
            }
            return;
        }
        tk=this.Match(Tipo.parizq,"Se esperaba '(' ");
        if(tk!=undefined){
            this.traduccion+="(";    
        }
        this.EXP();
        this.VALORES();
        tk=this.Match(Tipo.parder,"Se esperaba ')' ");
        if(tk!=undefined){
            this.traduccion+=")";
        }
    }
    VALORES(){
        var tk:Token|undefined;
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.coma){
            tk=this.Match(Tipo.coma,"Se esperaba ',' ");
            if(tk!=undefined){
                this.traduccion+=", ";
            }
            this.EXP();
            this.VALORES();
        }
    }
    IMPRIMIR(){
        var tk:Token|undefined;
        this.Match(Tipo.punto,"Se esperaba un '.' ");
       
        this.Match(Tipo.rout,"Se esperaba la palabra reservada 'out' ");
        
        tk=this.Match(Tipo.punto,"Se esperaba un '.' ");
        var aux:Token|undefined=this.IMPRIMIR_1();
        if(aux!=undefined){
            this.traduccion+="print";
        }        
        tk=this.Match(Tipo.parizq,"Se esperaba un '(' ");
        if(tk==undefined){return;}else{
            this.traduccion+="(";
        }
        this.EXP();
        if(aux!=undefined && aux.tipo==Tipo.rprintln){
            this.traduccion+=", end=\"\"";
        }
        tk=this.Match(Tipo.parder,"Se esperaba ')' ");
        if(tk!=undefined){
            this.traduccion+=")";
        }
    }
    IMPRIMIR_1():Token|undefined{
        var tk:Token|undefined;
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.rprint){
            tk=this.Match(Tipo.rprint,"Se esperaba la palabra reservada 'print' ");            
            return tk;
        }
        tk=this.Match(Tipo.rprintln,"Se esperaba la palabra reservada 'println' ");
        return tk;
    }
    IF_(){
        var tk:Token|undefined;
        tk=this.Match(Tipo.parizq,"Se esperaba '(' ");
        if(tk!=undefined){
            this.traduccion+="if ";
        }
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
            this.traduccion+="\n"+this.tabs+"el";
            this.IF_();
            return;
        }
        this.traduccion+="\n"+this.tabs+"else ";
        this.BLOQUEI();
    }
    DOWHILE_(){
        var tk:Token|undefined;
        this.BLOQUEI();
        tk=this.Match(Tipo.rwhile,"Se esperaba la palabra reservada 'while' ");
        if(tk!=undefined){
            this.tabs+="\t";
            this.traduccion+="if "
        }
        tk=this.Match(Tipo.parizq,"Se esperaba '(' ");
        this.EXP();
        this.Match(Tipo.parder,"Se esperaba ')' ");
        this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
        this.traduccion+=":\n"+this.tabs+"break";
        this.UnTabMenos();
    }
    WHILE_(){
        this.Match(Tipo.parizq,"Se esperaba '(' ");
        this.EXP();
        this.Match(Tipo.parder,"Se esperaba ')' ");
        this.BLOQUEI();
    }
    FOR_(){
        var tk:Token|undefined;
        this.Match(Tipo.parizq,"Se esperaba '(' ");
        this.T();
        tk=this.Match(Tipo.id,"Se esperaba un id ");
        if(tk!=undefined){
            this.traduccion+=tk.lexema+" in range ("
        }
        this.Match(Tipo.igual,"Se esperaba '=' ");
        this.EXP();
        this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
        this.traduccion+=", ";
        this.EXP();
        this.Match(Tipo.puntoycoma,"Se esperaba ';' ");
        this.Match(Tipo.id,"Se esperaba un id ");
        this.AUM();
        tk=this.Match(Tipo.parder,"Se esperaba ')' ");
        if(tk!=undefined){
            this.traduccion+=")";
        }
        this.BLOQUEI();
    }
    AUM(){
        const tk=this.preanalisis;
        const tp=tk.tipo;
        if(tp==Tipo.masmas){
            this.Match(Tipo.masmas,"Se esperaba '++' ");
            return;
        }
        this.Match(Tipo.menosmenos,"Se esperaba '--' ");
    }
    EXP(){
        this.A();
    }
    A(){
        this.B();
        this.A_1();
    }    
    A_1(){
        var tk:Token|undefined;
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.or){
            tk=this.Match(Tipo.or,"Se esperaba '|' ");
            tk=this.Match(Tipo.or,"Se esperaba '|' ");
            if(tk!=undefined){
                this.traduccion+=" or "
            }
            this.B();
            this.A_1();
        }
    }
    B(){
        this.C();
        this.B_1();
    }
    B_1(){
        var tk:Token|undefined;
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.xor){
            tk=this.Match(Tipo.xor,"Se esperaba '^' ");
            if(tk!=undefined){
                this.traduccion+=" xor "
            }
            this.C();
            this.B_1();
        }
    }
    C(){
        this.D();
        this.C_1();
    }
    C_1(){
        var tk:Token|undefined;
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.and){
            tk=this.Match(Tipo.and,"Se esperaba '&' ");
            tk=this.Match(Tipo.and,"Se esperaba '&' ");
            if(tk!=undefined){
                this.traduccion+=" and ";
            }
            this.D();
            this.C_1();
        }
    }
    D(){
        this.E();
        this.D_1();
    }
    D_1(){
        var tk:Token|undefined;
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.igual){
            tk=this.Match(Tipo.igual,"Se esperaba '=' ");
            tk=this.Match(Tipo.igual,"Se esperaba '=' ");
            if(tk!=undefined){
                this.traduccion+="==";
            }
            this.E();
            this.D_1();
        }else if(tp==Tipo.diferente){
            tk=this.Match(Tipo.diferente,"Se esperaba '!=' ");
            if(tk!=undefined){
                this.traduccion+="!=";
            }
            this.E();
            this.D_1();
        }
    }
    E(){
        this.F();
        this.E_1();
    }
    E_1(){
        var tk:Token|undefined;
        const tp:Tipo=this.preanalisis.tipo;
        switch(tp){
            case Tipo.menor:
                tk=this.Match(Tipo.menor,"Se esperaba '<' ");
                if(tk!=undefined){
                    this.traduccion+="<";
                }
                this.E_2();
                break;
            case Tipo.mayor:
                tk=this.Match(Tipo.mayor,"Se esperaba '>' ");
                if(tk!=undefined){
                    this.traduccion+=">";
                }
                this.E_2();
                break;
        }
    }

    E_2(){
        var tk:Token|undefined;
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.igual){
            tk=this.Match(Tipo.igual,"Se esperaba '=' ");
            if(tk!=undefined){
                this.traduccion+="=";
            }
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
        var tk:Token|undefined;
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.mas){
            tk=this.Match(Tipo.mas,"Se esperaba '+' ");
            if(tk!=undefined){
                this.traduccion+=" + ";
            }
            this.G();
            this.F_1();
        }else if(tp==Tipo.menos){
            tk=this.Match(Tipo.menos,"Se esperaba '-' ");
            if(tk!=undefined){
                this.traduccion+=" - ";
            }
            this.G();
            this.F_1();
        }
    }
    G(){
        this.H();
        this.G_1();
    }
    G_1(){
        var tk:Token|undefined;
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.por){
            tk=this.Match(Tipo.por,"Se esperaba '*' ");
            if(tk!=undefined){
                this.traduccion+=" * ";
            }
            this.H();
            this.G_1();
        }else if(tp==Tipo.division){
            tk=this.Match(Tipo.division,"Se esperaba '/' ");
            if(tk!=undefined){
                this.traduccion+=" / ";
            }
            this.H();
            this.G_1();
        }
    }
    H(){
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.id){
            const tk:Token|undefined=this.Match(Tipo.id,"Se esperaba un id ");
            if(tk!=undefined){
                this.traduccion+=tk.lexema;
            }
            this.J();
            return;
        }
        this.K();
    }
    J(){
        var tk:Token|undefined;
        const tp:Tipo=this.preanalisis.tipo;
        switch(tp){
            case Tipo.masmas:
                tk=this.Match(Tipo.masmas,"Se esperaba '++' ");
                if(tk!=undefined){
                    this.traduccion+=" += 1 ";
                }
                break;
            case Tipo.menosmenos:
                tk=this.Match(Tipo.menosmenos,"Se esperaba '--' ");
                if(tk!=undefined){
                    this.traduccion+=" -= 1 ";
                }
                break;
            case Tipo.parizq:
                tk=this.Match(Tipo.parizq,"Se esperaba '(' ");
                if(tk!=undefined){
                    this.traduccion+="(";
                }
                this.VALORES();
                tk=this.Match(Tipo.parder,"Se esperaba ')' ");
                if(tk!=undefined){
                    this.traduccion+=")";
                }
                break;
        }
    }
    K(){
        var tk:Token|undefined;
        const tp:Tipo=this.preanalisis.tipo;
        if(tp==Tipo.parizq){
            tk=this.Match(Tipo.parizq,"Se esperaba '(' ");
            if(tk!=undefined){
                this.traduccion+="(";
            }
            this.A();
            tk=this.Match(Tipo.parder,"Se esperaba ')' ");
            if(tk!=undefined){
                this.traduccion+=")";
            }
            return;
        }
        tk=this.VALOR();
        if(tk!=undefined){
            this.traduccion+=tk.lexema;
        }
    }
    VALOR():Token|undefined{
        var tk:Token|undefined=this.preanalisis;
        const tp:Tipo=tk.tipo;
        switch(tp){
            case Tipo.cadena:
                tk=this.Match(Tipo.cadena,"Se esperaba una cadena ");
                break;
            case Tipo.caracter:
                tk=this.Match(Tipo.caracter,"Se esperaba un caracter ");
                break;
            case Tipo.entero:
                tk=this.Match(Tipo.entero,"Se esperaba un numero entero");                
                break;
            case Tipo.double:
                tk=this.Match(Tipo.double,"Se esperaba un numero decimal ");
                break;
            case Tipo.rtrue:
                tk=this.Match(Tipo.rtrue,"Se esperaba un valor booleano ");
                break;
            case Tipo.rfalse:
                tk=this.Match(Tipo.rfalse,"Se esperaba un valor booleano ");
                break;
            default:
                this.Errores_("Se esperaba un valor string,char,int,double o boolean y se obtuvo "+tk.lexema,tk.fila,tk.columna)
                this.Panico();
                return undefined;
        }
        return tk;
    }

}
const parser=new Parser();
export default parser;