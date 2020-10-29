const Parser=require('../Analizador/parser');
const fs=require('fs');
const eol=require('eol');
class IndexController{
    async Index(req,res) {
        res.json({texto:"Bienvenido"});
    }
    async Analisis(req,res){
        //var documento=req.body.Value.toString();
        let output = '';

        fs.readFile('/home/alex/Documentos/Cursos Universidad/Compi 1/Lab/Proyecto2/[OLC1]Proyecto2/OLC1_Proyect2_201700539/Node_Api_JS/src/test/test.java','utf-8'
        ,(err,data)=>{
            if(err) throw res.json({Err:err.message});
            var resultado=Parser.parse(data);
            res.json(resultado);
        });
        // var resultado=Parser.parse(documento);
        // res.json(resultado);
    }
}
const indexController=new IndexController();
module.exports=indexController;