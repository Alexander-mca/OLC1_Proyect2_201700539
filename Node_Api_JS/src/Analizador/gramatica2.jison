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
"main"          return 'rmain';
"args"          return 'rargs';

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
%start INICIO

%% /* Definición de la gramática */

INICIO:CLASES EOF {$$=new Nodo('CLASES');
                $$.push($1);
                var errores=Errores; 
                Errores=[];
                return {AST:$$,Errores:errores}; }
;
CLASES: CLASES CLASE {$$=new Nodo('CLASES'); $$.push($1);$$.push($2);} 
        | CLASE  {$$=new Nodo('CLASES'); $$.push($1);}
;
CLASE: rpublic TCLASS id BLOQUEC {$$=new Nodo('CLASE');$$.push(new Nodo($1));
                $$.push($2);$$.push(new Nodo($3));$$.push($4);
                }
        |error llaveder         {Errores.push(('Error Sintáctico',"Se encontró '"+yytext+"' y se esperaba: una expresion.",this._$.first_line,this._$.first_column));
                               console.log('Error Sintactico, se encontro ('+yytext+') y se esperaba public, int,char,string,double o boolean. En linea:'+this._$.first_line+', Columna:'+this._$.first_column);}
;
TCLASS: rclass {$$=new Nodo('TCLASS');$$.push($1);
                 }
            |rinterface {$$=new Nodo('TCLASS');$$.push($1)
             
                }
;
BLOQUEC: llaveizq VARIASIC llaveder {$$=new Nodo('BLOQUEC');$$.push(new Nodo($1));
                                        $$.push($2);$$.push(new Nodo($3));
                                         }
        |llaveizq llaveder {$$=new Nodo('BLOQUEC');$$.push(new Nodo($1));
                                $$.push(new Nodo($2));
                                 }
;

VARIASIC: VARIASIC INSTCLASE    {$$=new Nodo('VARIASIC');$$.push($1);$$.push($2);
                                 }
        |INSTCLASE              {$$=new Nodo('VARIASIC');$$.push($1); }
        
;

INSTCLASE: FUNMET               {$$=new Nodo('INSTCLASE');$$.push($1); }
            |DECLARACION        {$$=new Nodo('INSTCLASE');$$.push($1);}
            |error puntoycoma   {Errores.push(('Error Sintáctico',"Se encontró '"+yytext+"' y se esperaba: una expresion.",this._$.first_line,this._$.first_column));
                                console.log('Error Sintactico, se encontro ('+yytext+') y se esperaba public, int,char,string,double o boolean. En linea:'+this._$.first_line+', Columna:'+this._$.first_column);}
;
DECLARACION: T ASIGNA {$$=new Nodo('DECLARARION');$$.push($1);$$.push($2);}
;

DECL: coma ASIGNA   {$$=new Nodo('DECL');+$$.push(new Nodo($1)); $$.push($2);}
        |puntoycoma           {$$=new Nodo('DECL');+$$.push(new Nodo($1));}
;

ASIGNA: id igual EXP DECL {$$=new Nodo('ASIGNA');$$.push(new Nodo($1));$$.push(new Nodo($2));$$.push($3);$$.push($4);              }
        |id DECL          {$$=new Nodo('ASIGNA');$$.push(new Nodo($1));$$.push($2);}
;

FUNMET: rpublic T_FM id parizq PARAMETROS parder T_IC {
                $$=new Nodo('FUNMET'); $$.push(new Nodo($1));
                $$.push($2); $$.push(new Nodo($3));
                $$.push(new Nodo($4)); 
                $$.push($5); $$.push(new Nodo($6)); $$.push($7);
                 
        }
        |rpublic T_FM id parizq  parder T_IC {
                $$=new Nodo('FUNMET'); $$.push(new Nodo($1));
                $$.push($2); $$.push(new Nodo($3));
                $$.push(new Nodo($4));$$.push(new Nodo($5)); $$.push($6);
                 
        }
        |rpublic rstatic rvoid rmain parizq rstring corizq corder rargs parder BLOQUEI {
                    $$=new Nodo('FUNMET'); $$.push(new Nodo($1)); $$.push(new Nodo($2));
                    $$.push(new Nodo($3)); $$.push(new Nodo($4)); $$.push(new Nodo($5));
                    $$.push(new Nodo($6));$$.push(new Nodo($7)); $$.push(new Nodo($8));
                    $$.push(new Nodo($9));$$.push(new Nodo($10));$$.push($11);
            }
        |error llaveder   {Errores.push(('Error Sintáctico',"Se encontró '"+yytext+"' y se esperaba: una expresion.",this._$.first_line,this._$.first_column));
                                console.log('Error Sintactico, se encontro ('+yytext+') y se esperaba public, int,char,string,double o boolean. En linea:'+this._$.first_line+', Columna:'+this._$.first_column);}
;
T_IC:   BLOQUEI {$$=new Nodo('T_IC');$$.push($1); }
        |puntoycoma {$$=new Nodo('T_IC');$$.push(new Nodo($1));}                         
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
                 }
                |T id {$$=new Nodo('PARAMETROS');$$.push($1);$$.push(new Nodo($2));}
;                
ASIGNACION: id igual EXP {$$=new Nodo('ASIGNACION');$$.push(new Nodo($1));
                $$.push(new Nodo($2));$$.push($3);
                 }
;
BLOQUEI: llaveizq INSTRUCCIONES llaveder {$$=new Nodo('BLOQUEI');$$.push(new Nodo($1));
                $$.push($2);$$.push(new Nodo($3));
                 }
        |llaveizq llaveder {$$=new Nodo('BLOQUEI');$$.push(new Nodo($1));$$.push(new Nodo($2));
                 }
;
INSTRUCCIONES: INSTRUCCIONES INSTRUCCION {$$=new Nodo('INSTRUCCIONES');$$.push($1);$$.push($2);}
                | INSTRUCCION {$$=new Nodo('INSTRUCCIONES');$$.push($1);}
;
INSTRUCCION: FOR                        {$$=new Nodo('INSTRUCCION');$$.push($1); }
                | WHILE                 {$$=new Nodo('INSTRUCCION');$$.push($1); }
                | DOWHILE               {$$=new Nodo('INSTRUCCION');$$.push($1); }
                | IF_                   {$$=new Nodo('INSTRUCCION');$$.push($1); }
                | rbreak puntoycoma      {$$=new Nodo('INSTRUCCION');$$.push(new Nodo($1));$$.push(new Nodo($2));                                 }
                | rcontinue puntoycoma   {$$=new Nodo('INSTRUCCION');$$.push(new Nodo($1));$$.push(new Nodo($2));
                                         }
                | rreturn EXP puntoycoma {$$=new Nodo('INSTRUCCION');$$.push(new Nodo($1));$$.push($2);$$.push(new Nodo($3));
                                         }
                | rreturn puntoycoma    {$$=new Nodo('INSTRUCCION');$$.push(new Nodo($1));$$.push(new Nodo($2));
                                         }
                | DECLARACION           {$$=new Nodo('INSTRUCCION');$$.push($1);}
                | ASIGNACION puntoycoma {$$=new Nodo('INSTRUCCION');$$.push($1);$$.push(new Nodo($2));
                                         }
                |LLAMADA puntoycoma     {$$=new Nodo('INSTRUCCION');$$.push($1);$$.push(new Nodo($2));
                                         }
                |AUM puntoycoma         {$$=new Nodo('INSTRUCCION');$$.push($1);$$.push(new Nodo($2));
                                         }
                | IMPRIMIR puntoycoma   {$$=new Nodo('INSTRUCCION');$$.push($1);$$.push(new Nodo($2));
                                         }
                |error puntoycoma       {Errores.push(('Error Sintáctico',"Se encontró '"+yytext+"' y se esperaba: una expresion.",this._$.first_line,this._$.first_column));
                                        console.log('Error Sintactico, se encontro ('+yytext+') y se esperaba public, int,char,string,double o boolean. En linea:'+this._$.first_line+', Columna:'+this._$.first_column);}
                |error llaveder         {Errores.push(('Error Sintáctico',"Se encontró '"+yytext+"' y se esperaba: una expresion.",this._$.first_line,this._$.first_column));
                                        console.log('Error Sintactico, se encontro ('+yytext+') y se esperaba public, int,char,string,double o boolean. En linea:'+this._$.first_line+', Columna:'+this._$.first_column);} 
;

LLAMADA: id parizq VALORES parder {
        $$=new Nodo('LLAMADA');$$.push(new Nodo($1));$$.push(new Nodo($2));
        $$.push($3);$$.push(new Nodo($4));
         
}
;
VALORES: VALORES coma EXP   {$$=new Nodo('VALORES');$$.push($1);$$.push(new Nodo($2));$$.push($3);
                                 }
        |EXP           {$$=new Nodo('VALORES');$$.push($1); }
;
AUM: id masmas     {$$=new Nodo('AUM');$$.push(new Nodo($2)); }
    |id menosmenos {$$=new Nodo('AUM');$$.push(new Nodo($2)); }
;
IMPRIMIR: rprint parizq EXP parder {$$=new Nodo('IMPRIMIR');
                $$.push(new Nodo($1));$$.push(new Nodo($2));
                $$.push($3);$$.push(new Nodo($4)); }
            | rprintln parizq EXP parder {$$=new Nodo('IMPRIMIR');
                $$.push(new Nodo($1));$$.push(new Nodo($2));
                $$.push($3);$$.push(new Nodo($4));
                 }
;
FOR: rfor parizq T id igual EXP puntoycoma EXP puntoycoma AUM parder BLOQUEI {
        $$=new Nodo('FOR');$$.push(new Nodo($1));$$.push(new Nodo($2));
        $$.push($3);$$.push(new Nodo($4));$$.push(new Nodo($5));
        $$.push($6);$$.push(new Nodo($7));$$.push($8);$$.push(new Nodo($9));
        $$.push($10);$$.push(new Nodo($11));$$.push($12);
}
;
WHILE: rwhile parizq EXP parder BLOQUEI {$$=new Nodo('WHILE');
        $$.push(new Nodo($1));$$.push(new Nodo($2));$$.push($3);$$.push(new Nodo($4));
        $$.push($5);  
}
;
DOWHILE: rdo BLOQUEI rwhile parizq EXP parder puntoycoma    {
        $$=new Nodo('DOWHILE');$$.push(new Nodo($1));$$.push($2);
        $$.push(new Nodo($3));$$.push(new Nodo($4));$$.push($5);
        $$.push(new Nodo($6));$$.push(new Nodo($7));
         
}
;
IF_:rif parizq EXP parder BLOQUEI ELSE_ {
        $$=new Nodo('IF_');$$.push(new Nodo($1));$$.push(new Nodo($2));
        $$.push($3);$$.push(new Nodo($4));$$.push($5);$$.push($6);
         
}
|rif parizq EXP parder BLOQUEI {
        $$=new Nodo('IF_');$$.push(new Nodo($1));$$.push(new Nodo($2));
        $$.push($3);$$.push(new Nodo($4));$$.push($5);
         
}
;
ELSE_: relse ELSE_1 {$$=new Nodo('ELSE_');$$.push(new Nodo($1));$$.push($2);
                     }
;
ELSE_1: IF_         {$$=new Nodo('ELSE_1');$$.push($1); }
        | BLOQUEI   {$$=new Nodo('ELSE_1');$$.push($1); }
;

EXP: EXP_LOG    {$$=new Nodo('EXP');$$.push($1); }
;
EXP_LOG:not EXP_REL            {$$=new Nodo('EXP_LOG');$$.push(new Nodo($1));$$.push($2); }
        |EXP_REL or EXP_REL    {$$=new Nodo('EXP_LOG');$$.push($1);$$.push(new Nodo($2));$$.push($3); }
        |EXP_REL xor EXP_REL   {$$=new Nodo('EXP_LOG');$$.push($1);$$.push(new Nodo($2));$$.push($3); }
        |EXP_REL and EXP_REL   {$$=new Nodo('EXP_LOG');$$.push($1);$$.push(new Nodo($2));$$.push($3); }
        |EXP_REL               {$$=new Nodo('EXP_LOG');$$.push($1); }
 ; 
EXP_REL: EXP_NUMERICA igualigual EXP_NUMERICA {$$=new Nodo('EXP_REL');$$.push($1);$$.push(new Nodo($2));$$.push($3); }
        |EXP_NUMERICA diferente EXP_NUMERICA  {$$=new Nodo('EXP_REL');$$.push($1);$$.push(new Nodo($2));$$.push($3); }
        |EXP_NUMERICA menor EXP_NUMERICA      {$$=new Nodo('EXP_REL');$$.push($1);$$.push(new Nodo($2));$$.push($3); }
        |EXP_NUMERICA mayor EXP_NUMERICA      {$$=new Nodo('EXP_REL');$$.push($1);$$.push(new Nodo($2));$$.push($3); }
        |EXP_NUMERICA mayorigual EXP_NUMERICA {$$=new Nodo('EXP_REL');$$.push($1);$$.push(new Nodo($2));$$.push($3); }
        |EXP_NUMERICA menorigual EXP_NUMERICA {$$=new Nodo('EXP_REL');$$.push($1);$$.push(new Nodo($2));$$.push($3); }
        |EXP_NUMERICA                         {$$=new Nodo('EXP_REL');$$.push($1); }
;
EXP_NUMERICA:menos EXP_NUMERICA %prec UMENOS {$$=new Nodo('EXP_NUMERICA');$$.push(new Nodo($1));$$.push($2); }
        |EXP_NUMERICA mas EXP_NUMERICA       {$$=new Nodo('EXP_NUMERICA');$$.push($1);$$.push(new Nodo($2));$$.push($3); }
        |EXP_NUMERICA menos EXP_NUMERICA     {$$=new Nodo('EXP_NUMERICA');$$.push($1);$$.push(new Nodo($2));$$.push($3); }
        |EXP_NUMERICA por EXP_NUMERICA       {$$=new Nodo('EXP_NUMERICA');$$.push($1);$$.push(new Nodo($2));$$.push($3); }
        |EXP_NUMERICA division EXP_NUMERICA  {$$=new Nodo('EXP_NUMERICA');$$.push($1);$$.push(new Nodo($2));$$.push($3); }
        |parizq EXP_NUMERICA parder          {$$=new Nodo('EXP_NUMERICA');$$.push(new Nodo($1));$$.push($2);$$.push(new Nodo($3)); }
        |AUM                                 {$$=new Nodo('EXP_NUMERICA');$$.push($1); }
        |LLAMADA                             {$$=new Nodo('EXP_NUMERICA');$$.push($1); }
        |VALOR                               {$$=new Nodo('EXP_NUMERICA');$$.push($1); }
        |id                                  {$$=new Nodo('EXP_NUMERICA');$$.push(new Nodo($1)); }
        |parizq error parder                 {Errores.push(('Error Sintáctico',"Se encontró '"+yytext+"' y se esperaba: una expresion.",this._$.first_line,this._$.first_column));
                                             console.log('Error Sintactico, se encontro ('+yytext+') y se esperaba public, int,char,string,double o boolean. En linea:'+this._$.first_line+', Columna:'+this._$.first_column);} 
;
    
VALOR:cadena    {$$=new Nodo('VALOR');$$.push(new Nodo($1));}
        |char   {$$=new Nodo('VALOR');$$.push(new Nodo($1));}
        |entero {$$=new Nodo('VALOR');$$.push(new Nodo($1));}
        |double {$$=new Nodo('VALOR');$$.push(new Nodo($1));}
        |rtrue  {$$=new Nodo('VALOR');$$.push(new Nodo($1));}
        |rfalse {$$=new Nodo('VALOR');$$.push(new Nodo($1));}
;