class Nodo{
    constructor(nombre){
        this._nombre=nombre;        
        this._hijos=[];
        this._id=0;
    }
    set Id(id){
        this._id=id;
    }
    push(hijo){
        this._hijos.push(hijo);
    }
    set Hijos(hijos){
        this._hijos=hijos;
    }
    get Id(){
        return this._id;
    }
    get Nombre(){
        return this._nombre;
    }
    get Hijos(){
        return this._hijos;
        
    }
}
module.exports.Nodo=Nodo;