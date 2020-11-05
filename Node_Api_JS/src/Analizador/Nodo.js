class Nodo{
    constructor(nombre){
        this.nombre=nombre;        
        this.hijos=[];
        this.id="";
    }
    setId(id){
        this.id=id;
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
    getId(){
        return this.id;
    }
    getNombre(){
        return this.nombre;
    }
    getHijos(){
        return this.hijos;
        
    }
}
module.exports=Nodo;