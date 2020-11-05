/*------------------------------------------------IMPORTACIONES----------------------------------------------*/
%{
//importaciones
        let tabs="";
        function UnTabMenos(){
                tabs.substring(0,tabs.length-1);
        }
%}
%lex
%options case-insensitive
%%

\s+											// se ignoran espacios en blanco
"/\/".*					return 'comentarioSimple';					// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]	return 'comentarioMulti';		// comentario multiple líneas

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

.	        {console.log(" ");} 
  

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

INICIO:CLASES EOF {$$=$1;return $$;}
;
CLASES: CLASES CLASE    {$$=$1+$2;} 
        |CLASE          {$$=$1;}
;
CLASE: rpublic TCLASS id BLOQUEC {
        if($2!='interface'){
                $$=$2+$3+$4;
        }
        $$='';
}
        |error llaveder          {$$='';}
;
TCLASS: rclass          {$$='class ';}
        |rinterface     {$$='interface';}
;
BLOQUEC: llaveizq VARIASIC llaveder     {tabs+='\t';$$=$1+"\n"+$2+"\n"+$3;UnTabMenos();}
        |llaveizq llaveder              {$$=$1+"\n"+$2;}
;

VARIASIC: VARIASIC INSTCLASE    {$$=$1+"\n"+tabs+$2;}
        |INSTCLASE              {$$="\n"+tabs+$1;}
        
;

INSTCLASE: FUNMET               {$$=$1;}
            |DECLARACION        {$$=$1;}
            |comentarioSimple   {$$=$1;}
            |comentarioMulti    {$$=$1;}
            |error puntoycoma   {$$="";}
;
DECLARACION: T ASIGNA {$$="var "+$2;}
;

DECL: coma ASIGNA       {$$=$1+" "+$2;}
        |puntoycoma     {$$=$1;}
;

ASIGNA: id igual EXP DECL {$$=$1+$2+$3+$4;}
        |id DECL          {$$=$1+$2;}
;

FUNMET: rpublic T_FM id parizq PARAMETROS parder T_IC {$$="\nfunction "+$3+$4+$5+$6+$7;}
        |rpublic T_FM id parizq  parder T_IC          {$$="\nfunction "+$3+$4+$5+$6;}
        |rpublic rstatic rvoid rmain parizq rstring corizq corder rargs parder BLOQUEI   {$$="";}
        |error llaveder   {$$="";}
;
T_IC:   BLOQUEI         {$$=$1;}
        |puntoycoma     {$$=$1;}                         
;

T_FM: rvoid {$$='';}
        |T {$$='';}
;
T: rint         {$$='';}
    |rdouble    {$$='';}
    |rboolean   {$$='';}
    |rstring    {$$='';}
    |rchar      {$$='';}
;
PARAMETROS: PARAMETROS coma T id {$$=$2+' '+$4;}
                |T id {$$=$2;}
;                
ASIGNACION: id igual EXP {$$=$1+$2+$3;}
;
BLOQUEI: llaveizq INSTRUCCIONES llaveder {tabs+="\t";$$=$1+"\n"+$2+"\n"+tabs+$3;UnTabMenos();}
        |llaveizq llaveder {$$=$1+"\n"+$2;}
;
INSTRUCCIONES: INSTRUCCIONES INSTRUCCION {$$=$1+"\n"+tabs+$2;}
                | INSTRUCCION {$$="\n"+$1;}
;
INSTRUCCION: FOR                        {$$=$1;}
                | WHILE                 {$$=$1;}
                | DOWHILE               {$$=$1;}
                | IF_                   {$$=$1;}
                | rbreak puntoycoma     {$$=$1+$2;}
                | rcontinue puntoycoma  {$$=$1+$2;}
                | rreturn EXP puntoycoma{$$=$1+" "+$2+$3;}
                | rreturn puntoycoma    {$$=$1+$2;}
                | DECLARACION           {$$=$1;}
                | ASIGNACION puntoycoma {$$=$1+$2;}
                | LLAMADA puntoycoma    {$$=$1+$2;}
                | AUM puntoycoma        {$$=$1+$2;}
                | IMPRIMIR puntoycoma   {$$=$1+$2;}
                | comentarioMulti       {$$=$1;}
                | comentarioSimple      {$$=$1;}
                | error puntoycoma      {$$="";}
                | error llaveder        {$$="";} 
;

LLAMADA: id parizq VALORES parder {$$=$1+$2+$3+$4;}
;
VALORES: VALORES coma EXP   {$$=$1+$2+" "+$3;}
        |EXP           {$$=$1;}
;
AUM: id masmas     {$$=$1+$2;}
    |id menosmenos {$$=$1+$2;}
;
IMPRIMIR: rprint parizq EXP parder {$$="console.log"+$2+$3+$4;}
            | rprintln parizq EXP parder {$$="console.log"+$1+$2+$3;}
;
FOR: rfor parizq T id igual EXP puntoycoma EXP puntoycoma AUM parder BLOQUEI {
        $$=$1+$2+"let "+$4+$5+$6+$7+$8+$9+$10+$11+$12;
}
;
WHILE: rwhile parizq EXP parder BLOQUEI {$$=$1+$2+$3+$4+$5;}
;
DOWHILE: rdo BLOQUEI rwhile parizq EXP parder puntoycoma {$$=$1+$2+$3+$4+$5+$6+$7;}
;
IF_:rif parizq EXP parder BLOQUEI ELSE_ {$$=$1+$2+$3+$4+$5+$6;}
        |rif parizq EXP parder BLOQUEI  {$$=$1+$2+$3+$4+$5;}
;
ELSE_: relse ELSE_1 {$$=$1+$2;}
;
ELSE_1: IF_         {$$=" "+$1;}
        | BLOQUEI   {$$=$1;}
;

EXP: EXP_LOG    {$$=$1;}
;
EXP_LOG:not EXP_REL            {$$=$1+$2;}
        |EXP_REL or EXP_REL    {$$=$1+" "+$2+" "+$3;}
        |EXP_REL xor EXP_REL   {$$=$1+" "+$2+" "+$3;}
        |EXP_REL and EXP_REL   {$$=$1+" "+$2+" "+$3;}
        |EXP_REL               {$$=$1;}
 ; 
EXP_REL: EXP_NUMERICA igualigual EXP_NUMERICA {$$=$1+$2+$3;}
        |EXP_NUMERICA diferente EXP_NUMERICA  {$$=$1+$2+$3;}
        |EXP_NUMERICA menor EXP_NUMERICA      {$$=$1+$2+$3;}
        |EXP_NUMERICA mayor EXP_NUMERICA      {$$=$1+$2+$3;}
        |EXP_NUMERICA mayorigual EXP_NUMERICA {$$=$1+$2+$3;}
        |EXP_NUMERICA menorigual EXP_NUMERICA {$$=$1+$2+$3;}
        |EXP_NUMERICA                         {$$=$1;} 
;
EXP_NUMERICA:menos EXP_NUMERICA %prec UMENOS {$$=$1+$2;}
        |EXP_NUMERICA mas EXP_NUMERICA       {$$=$1+$2+$3;}
        |EXP_NUMERICA menos EXP_NUMERICA     {$$=$1+$2+$3;}
        |EXP_NUMERICA por EXP_NUMERICA       {$$=$1+$2+$3;}
        |EXP_NUMERICA division EXP_NUMERICA  {$$=$1+$2+$3;}
        |parizq EXP_NUMERICA parder          {$$=$1+$2+$3; }
        |AUM                                 {$$=$1;}
        |LLAMADA                             {$$=$1;}
        |VALOR                               {$$=$1;}
        |id                                  {$$=$1;}
        |parizq error parder                 {$$="";} 
;
    
VALOR:cadena    {$$=$1;}
        |char   {$$=$1;}
        |entero {$$=$1;}
        |double {$$=$1;}
        |rtrue  {$$=$1;}
        |rfalse {$$=$1;}
;