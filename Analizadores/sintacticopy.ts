import {Scanner,Token,Error,Tipo,TipoErr} from './lexpython';

class Parser{
    tokens:Token[];
    errores:Error[];
    preanalisis:Token|null;
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

    }
    getNext():Token|undefined{
        if(this.i<this.tokens.length){
            this.i++;
            return this.preanalisis=this.tokens[this.i];
        }
    }
    Match(){

    }
    Error(){

    }
    Panico(){

    }
}
export{Parser}