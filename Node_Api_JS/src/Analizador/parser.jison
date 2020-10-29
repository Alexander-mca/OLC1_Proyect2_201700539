/*------------------------------------------------IMPORTACIONES----------------------------------------------*/
%{
//importaciones
        let Nodo=require('./Nodo.js');
        let traduccion="";
        let Errores=[];
        let tabs="";
        function UnTabMenos(){
                tabs.substring(0,tabs.length-1);
        }
%}
%lex
%options case-insensitive
%%

\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

"int"          return 'rint';
"double"          return 'rdouble';
"string"          return 'rstring';
"boolean"          return 'rboolean';
"char"          return 'rchar';
"while"          return 'rwhile';
"if"          return 'rif';
"do"          return 'rdo';
"else"          return 'relse';
"class"          return 'rclass';
"interface"          return 'rinterface';
"void"          return 'rvoid';
"system.out.print"          return 'rprint';
"system.out.println"          return 'rprintln';
"true"          return 'rtrue';
"false"          return 'rfalse';
"for"          return 'rfor';
"public"          return 'rpublic';
"static"          return 'rstatic';
"return"          return 'rreturn';
"break"          return 'rbreak';
"continue"          return 'rcontinue';
"main"          return 'main';

"["                   return 'corizq';  
"]"                   return 'corder';  
"{"                   return 'llaveizq';  
"}"                   return 'llaveder';  
";"                   return 'puntoycoma'; 
"++"                   return 'masmas';  
"--"                   return 'menosmenos';  
"+"                  return 'mas'; 
"-"                  return 'menos';
"*"                  return 'por';
"/"                  return 'division'
"("                   return 'parizq';  
")"                   return 'parder';  

"=="                   return 'igualigual';  
"!="                   return 'diferente';  
">="                   return 'mayorigual';  
"<="                   return 'menorigual'; 


">"                   return 'mayor';  
"<"                   return 'menor';
"="                   return 'igual';  

"!"                   return 'not';  

"&&"                   return 'and';  
"||"                 return 'or';
"^"                   return 'xor';  
"."                   return 'punto';  
","                   return 'coma';  


\"[^\"]*\"	   {yytext = yytext.substr(1,yyleng-2); return 'cadena';}

[0-9]+("."[0-9])?\b              return 'double';  
[0-9]+\b			return 'entero';
([A-Za-z])[A-Za-z0-9_]*     return 'id';
\'[^\']\'            return 'char';

[ \t\r\n\f\b]+          /*se ignoran*/ 

<<EOF>>       return 'EOF';   

.	        {Errores.push(('Error Lexico',"El Caracter '"+yytext +"' no pertenece al lenguaje.",yylloc.first_line, yylloc.first_column));} 
  

/lex

/* Asociación de operadores y precedencia */
%left 'or'
%left 'and'
%left 'xor'
%left 'diferente' 'igualigual'
%left 'mayor' 'mayorigual' 'menor' 'menorigual'
%left 'mas' 'menos'
%left 'por' 'division'
%left UMENOS 
%right 'not'
%start INICIO

%% /* Definición de la gramática */

INICIO:CLASES EOF {$$=new Nodo('CLASES');
                $$.push($1); 
                return {AST:$$,Errores:Errores,Traduccion:traduccion}; }
;
CLASES: CLASES CLASE {$$=new Nodo('CLASES'); $$.push($1);$$.push($2);} 
        | CLASE  {$$=new Nodo('CLASES'); $$.push($1);}
;
CLASE: rpublic TCLASS id BLOQUEC {$$=new Nodo('CLASE');$$.push(new Nodo($1));
                $$.push($2);$$.push(new Nodo($3));
                //se empieza la traduccion
                        if($2.getContenido()!='interface'){
                                traduccion+='\n'+$2.getContenido()+$3+$4.getContenido();
                                UnTabMenos();
                        }
                }
        //|error E         {$$=new Nodo('CLASE');Errores.push(('Error Sintáctico',"Se encontró '"+$1+"' y se esperaba: una expresion.",this._$.first_line,this._$.first_column));}
;
TCLASS: rclass {$$=new Nodo('TCLASS');$$.push($1);
                $$.setContenido("class");}
            |rinterface {$$=new Nodo('TCLASS');$$.push($1)
            $$.setContenido('interface');
                }
;
BLOQUEC: llaveizq VARIASIC llaveder {$$=new Nodo('BLOQUEC');$$.push(new Nodo('{'));
                                        $$.push($2);$$.push(new Nodo('}'));tabs+="\t";
                                        $$.setContenido('{'+$2.getContenido()+'\n}');}
        |llaveizq llaveder {$$=new Nodo('BLOQUEC');$$.push(new Nodo('{'));
                                $$.push(new Nodo('}'));
                                $$.setContenido('{\n}');}
;

VARIASIC: VARIASIC INSTCLASE    {$$=new Nodo('VARIASIC');$$.push($1);$$.push($2);
                                $$.setContenido($1.getContenido()+$2.getContenido());}
        |INSTCLASE              {$$=new Nodo('VARIASIC');$$.push($1);$$.setContenido($1.getContenido());UnTabMenos();}
        
;

INSTCLASE: FUNMET       {$$=new Nodo('INSTCLASE');$$.push($1);$$.setContenido($1.getContenido());}
            |DECLARACION{$$=new Nodo('INSTCLASE');$$.push($1);
                        $$.setContenido($1.getContenido());}
            //|error E    {$$=new Nodo('INSTCLASE');Errores.push(('Error Sintáctico',"Se encontró '"+$1+"' y se esperaba: una expresion.",this._$.first_line,this._$.first_column));}
;
DECLARACION: T id ASIGNA {$$=new Nodo('DECLARACION');$$.push($1);
                                $$.push(new Nodo($2)); $$.push($3);
                                $$.setContenido("\n"+tabs+"var "+$2+$3.getContenido());}
        | T id           {$$=new Nodo('DECLARACION');$$.push($1);
                                $$.push(new Nodo($2));$$.setContenido('\n'+tabs+"var "+$2);}
        
        
;

DECL: DECL coma id ASIGNA  {$$=new Nodo('DECL');$$.push($1);$$.push(new Nodo($2));
                                $$.push(new Nodo($3)); $$.push($4);
                                $$.setContenido('\n'+$1.getContenido()+$2+ $3 +$4.getContenido());}
        |coma id ASIGNA {$$=new Nodo('DECL');+$$.push(new Nodo($1));
                $$.push(new Nodo($2)); $$.push($3);
                $$.setContenido('\n'+$1+ $2 +$3.getContenido());

        }
;

ASIGNA: igual EXP {$$=new Nodo('ASIGNA');$$.push(new Nodo($1));$$.push($2);
                        $$.setContenido('= '+$2.getContenido());}
        |DECL     {$$=new Nodo('ASIGNA');$$.push($1);$$.setContenido($1.getContenido());}
;

FUNMET: rpublic T_FM id parizq PARAMETROS parder T_IC {
                $$=new Nodo('FUNMET'); $$.push(new Nodo($1));
                $$.push($2); $$.push(new Nodo($3));
                $$.push(new Nodo($4)); 
                $$.push($5); $$.push(new Nodo($6)); $$.push($7);
                $$.setContenido('\n'+tabs+'function '+$3+$4+$5.getContenido()+$6+$7.getContenido());
        }
            |rpublic rstatic rvoid rmain parizq rstring corizq corder args parder BLOQUEI {
                    $$=new Nodo('FUNMET'); $$.push(new Nodo($1)); $$.push(new Nodo($2));
                    $$.push(new Nodo($3)); $$.push(new Nodo($4)); $$.push(new Nodo($5));
                    $$.push(new Nodo($6));$$.push(new Nodo($7)); $$.push(new Nodo($8));
                    $$.push(new Nodo($9));$$.push(new Nodo($10));$$.push($11);
                    //traduccion
            }
;
T_IC: puntoycoma {$$=new Nodo('T_IC');$$.push(new Nodo($1));}
        | BLOQUEI {$$=new Nodo('T_IC');$$.push($1);
                        $$.setContenido($1.getContenido());}
;

T_FM: rvoid {$$=new Nodo('T_FM');$$.push(new Nodo($1));}
        |T {$$=new Nodo('T_FM');$$.push($1);}
;
T: rint         {$$=new Nodo('T');$$.push(new Nodo($1));}
    |rdouble    {$$=new Nodo('T');$$.push(new Nodo($1));}
    |rboolean   {$$=new Nodo('T');$$.push(new Nodo($1));}
    |rstring    {$$=new Nodo('T');$$.push(new Nodo($1));}
    |rchar      {$$=new Nodo('T');$$.push(new Nodo($1));}
;
PARAMETROS: PARAMETROS coma T id {$$=new Nodo('PARAMETROS');$$.push($1);
                $$.push(new Nodo($2));$$.push($3);$$.push(new Nodo($4));
                $$.setContenido($1.getContenido()+$2+" "+$4);}
                |T id {$$=new Nodo('PARAMETROS');$$.push($1);$$.push(new Nodo($2));}
;                
ASIGNACION: id igual EXP {$$=new Nodo('ASIGNACION');$$.push(new Nodo($1));
                $$.push(new Nodo($2));$$.push($3);
                $$.setContenido('\n'+$1+' = '+$3.getContenido());}
;
BLOQUEI: llaveizq INSTRUCCIONES llaveder {$$=new Nodo('BLOQUEI');$$.push(new Nodo($1));
                $$.push($2);$$.push(new Nodo($3));tabs+="\t";
                $$.setContenido('{'+$2.getContenido()+'\n}');}
        |llaveizq llaveder {$$=new Nodo('BLOQUEI');$$.push(new Nodo($1));$$.push(new Nodo($2));
                $$.setContenido('{\n}');}
;
INSTRUCCIONES: INSTRUCCIONES INSTRUCCION {$$=new Nodo('INSTRUCCIONES');$$.push($1);$$.push($2);
                if($2 instanceof Nodo){$$.setContenido($1.getContenido()+$2.getContenido());}}
                | INSTRUCCION {$$=new Nodo('INSTRUCCIONES');$$.push($1);
                                if($1 instanceof Nodo){$$.setContenido($1.getContenido());UnTabMenos();}}
;
INSTRUCCION: FOR                        {$$=new Nodo('INSTRUCCION');$$.push($1);$$.setContenido($1.getContenido());}
                | WHILE                 {$$=new Nodo('INSTRUCCION');$$.push($1);$$.setContenido($1.getContenido());}
                | DOWHILE               {$$=new Nodo('INSTRUCCION');$$.push($1);$$.setContenido($1.getContenido());}
                | IF_                   {$$=new Nodo('INSTRUCCION');$$.push($1);$$.setContenido($1.getContenido());}
                | rbreak puntoycoma      {$$=new Nodo('INSTRUCCION');$$.push(new Nodo($1));$$.push(new Nodo($2));
                                        $$.setContenido('\n'+tabs+$1+$2);}
                | rcontinue puntoycoma   {$$=new Nodo('INSTRUCCION');$$.push(new Nodo($1));$$.push(new Nodo($2));
                                        $$.setContenido('\n'+tabs+$1+$2);}
                | rreturn EXP puntoycoma{$$=new Nodo('INSTRUCCION');$$.push(new Nodo($1));$$.push($2);$$.push(new Nodo($3));
                                        $$.setContenido('\n'+tabs+$1+$2.getContenido()+$3);}
                | rreturn puntoycoma    {$$=new Nodo('INSTRUCCION');$$.push(new Nodo($1));$$.push(new Nodo($2));
                                        $$.setContenido('\n'+tabs+$1+$2);}
                | DECLARACION puntoycoma{$$=new Nodo('INSTRUCCION');$$.push($1);$$.push(new Nodo($2));
                                        $$.setContenido($1.getContenido()+$2);}
                | ASIGNACION puntoycoma {$$=new Nodo('INSTRUCCION');$$.push($1);$$.push(new Nodo($2));
                                        $$.setContenido($1.getContenido()+$2);}
                |LLAMADA puntoycoma     {$$=new Nodo('INSTRUCCION');$$.push($1);$$.push(new Nodo($2));
                                        $$.setContenido('\n'+tabs+$1.getContenido()+$2);}
                |AUM puntoycoma         {$$=new Nodo('INSTRUCCION');$$.push($1);$$.push(new Nodo($2));
                                        $$.setContenido('\n'+tabs+$1.getContenido()+$2);}
                | IMPRIMIR puntoycoma   {$$=new Nodo('INSTRUCCION');$$.push($1);$$.push(new Nodo($2));
                                        $$.setContenido('\n'+tabs+$1.getContenido()+$2);}
                //|error E                {Errores.push(('Error Sintáctico',"Se encontró '"+$1+"' y se esperaba: una expresion.",this._$.first_line,this._$.first_column));} 
;
E: puntoycoma
        |parder
        |llaveder
;
LLAMADA: id parizq VALORES parder {
        $$=new Nodo('LLAMADA');$$.push(new Nodo($1));$$.push(new Nodo($2));
        $$.push($3);$$.push(new Nodo($4));
        $$.setContenido($1+$2+$3.getContenido()+$4);
}
;
VALORES: VALORES coma EXP   {$$=new Nodo('VALORES');$$.push($1);$$.push(new Nodo($2));$$.push($3);
                                $$.setContenido($1.getContenido()+$2+$3.getContenido());}
        |EXP           {$$=new Nodo('VALORES');$$.push($1);$$.setContenido($1.getContenido());}
;
AUM: id masmas     {$$=new Nodo('AUM');$$.push(new Nodo($2));$$.setContenido($1+$2);}
    |id menosmenos {$$=new Nodo('AUM');$$.push(new Nodo($2));$$.setContenido($1+$2);}
;
IMPRIMIR: rprint parizq EXP parder{$$=new Nodo('IMPRIMIR');
                $$.push(new Nodo($1));$$.push(new Nodo($2));
                $$.push($3);$$.push(new Nodo($4));$$.setContenido('console.log('+$3.getContenido()+')');}
            | rprintln parizq EXP parder{$$=new Nodo('IMPRIMIR');
                $$.push(new Nodo($1));$$.push(new Nodo($2));
                $$.push($3);$$.push(new Nodo($4));
                $$.setContenido('console.log('+$3.getContenido()+'\\n)');}
;
FOR: rfor parizq T id igual EXP puntoycoma EXP puntoycoma EXP_AD parder BLOQUEI {
        $$=new Nodo('FOR');$$.push(new Nodo($1));$$.push(new Nodo($2));
        $$.push($3);$$.push(new Nodo($4));$$.push(new Nodo($5));
        $$.push($6);$$.push(new Nodo($7));$$.push($8);$$.push(new Nodo($9));
        $$.push($10);$$.push(new Nodo($11));$$.push($12);
        $$.setContenido('\n'+tabs+$1+$2+$4+$5+$6.getContenido()+$7+$8.getContenido()+$9+$10.getContenido()
        +$11+$12.getContenido());
}
;
WHILE: rwhile parizq EXP parder BLOQUEI {$$=new Nodo('WHILE');
        $$.push(new Nodo($1));$$.push(new Nodo($2));$$.push($3);$$.push(new Nodo($4));
        $$.push($5); $$.setContenido('\n'+tabs+$1+$2+$3.getContenido()+$4+$5.getContenido());
}
;
DOWHILE: rdo BLOQUEI rwhile parizq EXP parder puntoycoma    {
        $$=new Nodo('DOWHILE');$$.push(new Nodo($1));$$.push($2);
        $$.push(new Nodo($3));$$.push(new Nodo($4));$$.push($5);
        $$.push(new Nodo($6));$$.push(new Nodo($7));
        $$.setContenido('\n'+tabs+$1+$2.getContenido()+$3+$4+$5.getContenido()+$6+$7);
}
;
IF_:rif parizq EXP parder BLOQUEI ELSE_ {
        $$=new Nodo('IF_');$$.push(new Nodo($1));$$.push(new Nodo($2));
        $$.push($3);$$.push(new Nodo($4));$$.push($5);$$.push($6);
        $$.setContenido('\n'+tabs+$1+$2+$3.getContenido()+$4+$5.getContenido()+$6.getContenido());
}
|rif parizq EXP parder BLOQUEI{
        $$=new Nodo('IF_');$$.push(new Nodo($1));$$.push(new Nodo($2));
        $$.push($3);$$.push(new Nodo($4));$$.push($5);
        $$.setContenido('\n'+tabs+$1+$2+$3.getContenido()+$4+$5.getContenido());
}
;
ELSE_: relse ELSE_1 {$$=new Nodo('ELSE_');$$.push(new Nodo($1));$$.push($2);
                    $$.setContenido(tabs+$1+$2.getContenido());}
;
ELSE_1: IF_         {$$=new Nodo('ELSE_1');$$.push($1);$$.setContenido($1.getContenido());}
        | BLOQUEI   {$$=new Nodo('ELSE_1');$$.push($1);$$.setContenido($1.getContenido());}
;

EXP: EXP_LOG    {$$=new Nodo('EXP');$$.push($1);$$.setContenido($1.getContenido());}
;
EXP_LOG:not EXP_REL            {$$=new Nodo('EXP_LOG');$$.push(new Nodo($1));$$.push($2);$$.setContenido($1+$2.getContenido());}
        |EXP_REL or EXP_REL    {$$=new Nodo('EXP_LOG');$$.push($1);$$.push(new Nodo($2));$$.push($3);$$.setContenido($1.getContenido()+' '+$2+' '+$3.getContenido());}
        |EXP_REL xor EXP_REL   {$$=new Nodo('EXP_LOG');$$.push($1);$$.push(new Nodo($2));$$.push($3);$$.setContenido($1.getContenido()+' '+$2+' '+$3.getContenido());}
        |EXP_REL and EXP_REL   {$$=new Nodo('EXP_LOG');$$.push($1);$$.push(new Nodo($2));$$.push($3);$$.setContenido($1.getContenido()+' '+$2+' '+$3.getContenido());}
        |EXP_REL               {$$=new Nodo('EXP_LOG');$$.push($1);$$.setContenido($1.getContenido());}
 ; 
EXP_REL: EXP_NUMERICA igualigual EXP_NUMERICA{$$=new Nodo('EXP_REL');$$.push($1);$$.push(new Nodo($2));$$.push($3);$$.setContenido($1.getContenido()+$2+$3.getContenido());}
        |EXP_NUMERICA diferente EXP_NUMERICA {$$=new Nodo('EXP_REL');$$.push($1);$$.push(new Nodo($2));$$.push($3);$$.setContenido($1.getContenido()+$2+$3.getContenido());}
        |EXP_NUMERICA menor EXP_NUMERICA     {$$=new Nodo('EXP_REL');$$.push($1);$$.push(new Nodo($2));$$.push($3);$$.setContenido($1.getContenido()+$2+$3.getContenido());}
        |EXP_NUMERICA mayor EXP_NUMERICA     {$$=new Nodo('EXP_REL');$$.push($1);$$.push(new Nodo($2));$$.push($3);$$.setContenido($1.getContenido()+$2+$3.getContenido());}
        |EXP_NUMERICA mayorigual EXP_NUMERICA{$$=new Nodo('EXP_REL');$$.push($1);$$.push(new Nodo($2));$$.push($3);$$.setContenido($1.getContenido()+$2+$3.getContenido());}
        |EXP_NUMERICA menorigual EXP_NUMERICA{$$=new Nodo('EXP_REL');$$.push($1);$$.push(new Nodo($2));$$.push($3);$$.setContenido($1.getContenido()+$2+$3.getContenido());}
        |EXP_NUMERICA                        {$$=new Nodo('EXP_REL');$$.push($1);$$.setContenido($1.getContenido());}
;
EXP_NUMERICA:menos EXP_NUMERICA %prec UMENOS {$$=new Nodo('EXP_NUMERICA');$$.push(new Nodo($1));$$.push($2);$$.setContenido($1+$2.getContenido());}
        |EXP_NUMERICA mas EXP_NUMERICA       {$$=new Nodo('EXP_NUMERICA');$$.push($1);$$.push(new Nodo($2));$$.push($3);$$.setContenido($1.getContenido()+' '+$2+' '+$3.getContenido());}
        |EXP_NUMERICA menos EXP_NUMERICA     {$$=new Nodo('EXP_NUMERICA');$$.push($1);$$.push(new Nodo($2));$$.push($3);$$.setContenido($1.getContenido()+' '+$2+' '+$3.getContenido());}
        |EXP_NUMERICA por EXP_NUMERICA       {$$=new Nodo('EXP_NUMERICA');$$.push($1);$$.push(new Nodo($2));$$.push($3);$$.setContenido($1.getContenido()+' '+$2+' '+$3.getContenido());}
        |EXP_NUMERICA division EXP_NUMERICA  {$$=new Nodo('EXP_NUMERICA');$$.push($1);$$.push(new Nodo($2));$$.push($3);$$.setContenido($1.getContenido()+' '+$2+' '+$3.getContenido());}
        |parizq EXP parder                   {$$=new Nodo('EXP_NUMERICA');$$.push(new Nodo($1));$$.push($2);$$.push(new Nodo($3));$$.setContenido($1+$2.getContenido()+$3);}
        |AUM                                 {$$=new Nodo('EXP_NUMERICA');$$.push($1);$$.setContenido($1.getContenido());}
        |LLAMADA                             {$$=new Nodo('EXP_NUMERICA');$$.push($1);$$.setContenido($1.getContenido());}
        |VALOR                               {$$=new Nodo('EXP_NUMERICA');$$.push($1);$$.setContenido($1.getContenido());}
        |id                                  {$$=new Nodo('EXP_NUMERICA');$$.push(new Nodo($1));$$.setContenido($1);}
        //|error E                             {Errores.push(('Error Sintáctico',"Se encontró '"+yytext+"' y se esperaba: una expresion.",this._$.first_line,this._$.first_column));} 
;
    
VALOR:cadena    {$$=new Nodo('VALOR');$$.push(new Nodo($1));}
        |char   {$$=new Nodo('VALOR');$$.push(new Nodo($1));}
        |entero {$$=new Nodo('VALOR');$$.push(new Nodo($1));}
        |double {$$=new Nodo('VALOR');$$.push(new Nodo($1));}
        |rtrue  {$$=new Nodo('VALOR');$$.push(new Nodo($1));}
        |rfalse {$$=new Nodo('VALOR');$$.push(new Nodo($1));}
;