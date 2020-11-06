const Parser=require('../Analizador/gramatica2');
const Trad=require('../Analizador/traduccion');
const fs=require('fs');
const Arbol = require('../Analizador/GenerateTree');
const funciones=require('./funciones');
class IndexController{
    async Index(req,res) {
        res.json({texto:"Bienvenido"});
    }
    async Analisis(req,res){
        var documento=req.body.Value.toString();
        console.log("***************************************\n"+documento);
        console.log("------------------Si entra a Analisis en js------------------");
        // fs.readFile('/home/alex/Documentos/Cursos Universidad/Compi 1/Lab/Proyecto2/[OLC1]Proyecto2/OLC1_Proyect2_201700539/test/test.java','utf-8'
        // ,(err,data)=>{
        //     if(err) throw res.json({Err:err.message});
        //     var resultado=Parser.parse(data);
        //     res.json(resultado);
        // });
        var resultado=Parser.parse(documento);
        var errores=funciones.getErrores(resultado.Errores);
        var traduccion=Trad.parse(documento);
        console.log("***************************************\n");
        var arbol=new Arbol(resultado.AST);
        arbol.ejecutar();
        funciones.ReporteErrores(resultado.Errores);
        var aux=traduccion.Traduccion;
        traduccion.Traduccion=errores+aux;
        console.log("*******************************************\n"+traduccion.Traduccion);
        res.send(traduccion.Traduccion);
    }
    async MostrarArbol(req,res){    
        if(fs.existsSync('arbol.svg')){   
        var imagen=fs.readFileSync('arbol.svg', 'utf-8');
        res.send(imagen);
        }
       
    }
    async MostrarErrores(req,res){
        if(fs.existsSync('errores.html')){
            var err=fs.readFileSync('errores.html', 'utf-8');
            res.send(err);
        }else{
            res.json({Info:"No hubieron errores"});
        }
    }
    
}
const indexController=new IndexController();
module.exports=indexController;