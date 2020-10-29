/*------------------------------------------------IMPORTACIONES----------------------------------------------*/
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

[0-9]+("."[0-9])?\b              return 'double';  
[0-9]+\b				return 'entero';
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

"="                   return 'igual';  
">"                   return 'mayor';  
"<"                   return 'menor';  
"!"                   return 'not';  

"&&"                   return 'and';  
"||"                 return 'or';
"^"                   return 'xor';  
"."                   return 'punto';  
","                   return 'coma';  

([A-Za-z])[A-Za-z0-9_]*     return 'id';

\"[^\"]*\"				 {yytext = yytext.substr(1,yyleng-2); return 'cadena';}
"'"."'"            return 'char';

[ \t\r\n\f]+          /*se ignoran*/ 

<<EOF>>       return 'EOF';   

.	        {document.getElementById("txtsalida1"+publico_id).value+='Error Lexico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column +"\n";} 
  

/lex
%{
//importaciones

%}
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

INICIO:CLASES {}
;
CLASES: CLASES CLASE {} 
            |CLASE  {}
;
CLASE: rpublic TCLASS id BLOQUEC {}
;
TCLASS: rclass {}
            |rinterface {}
;
BLOQUEC: llaveizq INSTCLASE llaveder {}
        |llaveizq llaveder {}
;
INSTCLASE: FUNMET {}
            |DECLARACION {}
;
DECLARACION: T id ASIGNA DECL {}
;

DECL: DECL coma id ASIGNA  {} 
        | {}
;

ASIGNA: igual EXP {}
            |  {}
;

FUNMET: rpublic T_FM id parizq T id PARAMETROS parder T_IC {}
            |rpublic rstatic rvoid rmain parizq rstring corizq corder args parder BLOQUEI {}
;
T_IC: puntoycoma {}
        | BLOQUEI {}
;

T_FM: rvoid {}
        |T {}
;
T: rint {}
    |rdouble {}
    |rboolean  {}
    |rstring {}
    |rchar {}
;
PARAMETROS:  coma T id PARAMETROS {}
                | {}
;                
ASIGNACION: id igual EXP {}
;
BLOQUEI: llaveizq INSTRUCCIONES llaveder {}
        |llaveizq llaveder {}
;
INSTRUCCIONES: INSTRUCCIONES INSTRUCCION {}
                | INSTRUCCION {}
;
INSTRUCCION: FOR {}
                | WHILE {}
                | DOWHILE {}
                | IF_ {}
                | break puntoycoma          {}
                | continue puntoycoma       {}
                | rreturn EXP puntoycoma    {}
                | rreturn puntoycoma        {}
                | DECLARACION puntoycoma    {}
                | ASIGNACION puntoycoma     {}
                | IMPRIMIR puntoycoma       {}
;
IMPRIMIR: rsystem punto rout punto rprint parizq EXP parder         {}
            | rsystem punto rout punto rprintln parizq EXP parder   {}
;
FOR: rfor parizq T id igual EXP puntoycoma EXP puntoycoma EXP_AD parder BLOQUEI {}
;
WHILE: rwhile parizq EXP parder BLOQUEI {}
;
DOWHILE: rdo BLOQUEI rwhile parizq EXP parder puntoycoma    {}
;
IF_:rif parizq EXP parder BLOQUEI ELSE_ {}
;
ELSE_: relse ELSE_1 {}
        |           {}
;
ELSE_1: IF_         {}
        | BLOQUEI   {}
;

EXP: EXP_LOG
;
EXP_LOG:not EXP_REL            {}
        |EXP_REL or EXP_REL    {}
        |EXP_REL xor EXP_REL   {}
        |EXP_REL and EXP_REL   {}
        |EXP_REL               {}
 ; 
EXP_REL: EXP_NUMERICA igualigual EXP_NUMERICA     {}
        |EXP_NUMERICA diferente EXP_NUMERICA      {}
        |EXP_NUMERICA menor EXP_NUMERICA          {}
        |EXP_NUMERICA mayor EXP_NUMERICA          {}
        |EXP_NUMERICA mayorigual EXP_NUMERICA     {}
        |EXP_NUMERICA menorigual EXP_NUMERICA     {}
;
EXP_NUMERICA
        :menos EXP_NUMERICA %prec UMENOS    {}
        |EXP_NUMERICA mas EXP_NUMERICA      {}
        |EXP_NUMERICA menos EXP_NUMERICA    {}
        |EXP_NUMERICA por EXP_NUMERICA      {}
        |EXP_NUMERICA division EXP_NUMERICA {}
        |parizq EXP_NUMERICA parder         {}
        |VALOR
        |id M

;
M: masmas
    |menosmenos
    |
;      
VALOR:string    {$$=$1;}
        |char   {$$=$1;}
        |int    {$$=$1;}
        |double {$$=$1;}
        |rtrue  {$$=$1;}
        |rfalse {$$=$1;}
;