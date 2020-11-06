const Nodo=require('./Nodo');
const fs=require('fs');
const execSync=require('child_process').exec;
class Arbol{
    constructor(raiz){
        this.cont=0;
        this.raiz=raiz;
        this.contenido="";
        this.relacion="";           
    }
    ejecutar(){
        this.contenido="digraph D{node[shape=circle fillcolor=green style=filled];\n";
        this.getNodos(this.raiz);
        this.getRelacion(this.raiz);
        this.contenido+=this.relacion+"}";
        this.Tree();
        this.relacion="";
        this.cont=0;
        this.contenido="";
    }
    getNodos(nodo){
        if(nodo.Nombre.includes("error")){
            this.contenido+="node"+this.cont+"[label=\""+nodo.Nombre+"\" fillcolor=red style=filled];\n";
        }else{
        this.contenido+="node"+this.cont+"[label=\""+nodo.Nombre+"\"];\n";
        }
        nodo.Id=this.cont;
        this.cont++;
        nodo.Hijos.forEach(hijo => {
            this.getNodos(hijo);
        });
    }
    getRelacion(raiz){
        raiz.Hijos.forEach(hijo=>{
            this.relacion+="\"node"+raiz.Id+"\"->";
            this.relacion+="\"node"+hijo.Id+"\";\n";
            this.getRelacion(hijo);
        });
    }
    Tree(){
        fs.writeFile('arbol.txt', this.contenido, error => {
            if (error)
              console.log(error);
            else
              console.log('El archivo fue creado');
          });
        execSync('dot -Tsvg arbol.txt -o arbol.svg');
        console.log('-----------------------La imagen ha sido generada------------');
        //window.open("http://localhost:3080/arbol.svg");
    }
}
module.exports=Arbol;