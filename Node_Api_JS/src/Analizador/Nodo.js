class Nodo{
    constructor(nombre){
        this.nombre=nombre;        
        this.hijos=[];
    }
    push(hijo){
        this.hijos.push(hijo);
    }
    getContenido(){
        return this.contenido;
    }
    setContenido(contenido){
        this.contenido=contenido;
    }
    getNombre(){
        return this.nombre;
    }
    getHijos(){
        return this.hijos;
        
    }
}
module.exports=Nodo;