const Nodo=require('./Nodo');
class Arbol{
    constructor(raiz){
        this.cont=0;
        this.contenido="digraph D{node[shape=circle fillcolor=green style=filled];\n";
        this.getNodos(raiz,contenido);
        this.getRelacion(raiz,contenido);
        this.contenido+="}";
        
    }
    getContenido(){
        return this.contenido;
    }
    getNodos(raiz,contenido){
        contenido+="node"+this.cont+"[label=\""+raiz.getNombre()+"\"];\n";
        raiz.setId(this.cont);
        this.cont++;
        raiz.getHijos().forEach(hijo => {
            this.getNodos(hijo,contenido);
        });
    }
    getRelacion(raiz,relacion){
        raiz.getHijos().forEach(hijo=>{
            relacion+="\"node"+raiz.getId()+"\"->";
            relacion+="\""+hijo.getId()+"\";\n";
            this.getRelacion(hijo,relacion);
        });
    }
}
module.exports=Arbol;