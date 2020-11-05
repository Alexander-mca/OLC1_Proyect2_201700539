const Parser=require('../Analizador/gramatica2');
const Trad=require('../Analizador/traduccion');
const fs=require('fs');
const execSync=require('child_process').execSync;
const Arbol = require('../Analizador/GenerateTree');
class IndexController{
    async Index(req,res) {
        res.json({texto:"Bienvenido"});
    }
    async Analisis(req,res){
        var documento=req.body.Value.toString();

        // fs.readFile('/home/alex/Documentos/Cursos Universidad/Compi 1/Lab/Proyecto2/[OLC1]Proyecto2/OLC1_Proyect2_201700539/test/test.java','utf-8'
        // ,(err,data)=>{
        //     if(err) throw res.json({Err:err.message});
        //     var resultado=Parser.parse(data);
        //     res.json(resultado);
        // });
         var resultado=Parser.parse(documento);
         var traducion=Trad.parse(documento);
         var arbol=new Arbol(resultado.AST);
         var ast=arbol.getContenido();
         this.Tree(ast);
         this.ReporteErrores(resultado.Errores);
         var result={
             Traduccion:traducion
         }
         res.json(result);
    }
    ReporteErrores(errores){
        var cont=0;
        var contenido="<html>\n<head>\n<title>Errores</title>\n</head>"+
        "\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css\" integrity=\"sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2\" crossorigin=\"anonymous\">\n<body>";
        contenido+="\n<table class=\"table table-hover\">\n<thead>\n";
        contenido+="<tr>\n<th scope=\"col\">No.</th>"+
        "\n<th scope=\"col\">Tipo</th>\n<th scope=\"col\">Descripcion</th>"+
        "\n<th scope=\"col\">Linea</th>\n<th scope=\"col\">Columna</th>\n</tr>\n</thead>";
        contenido+="\n<tbody>";
        errores.forEach(err => {
            contenido+="\n<tr class=\"table-info\">\n<td scope=\"row\">"+cont+"</td>"+
            "\n<td>"+err[0]+"</td>"+"\n<td>"+err[1]+"</td>"
            "\n<td>"+err[2]+"</td>"+"\n<td>"+err[3]+"</td>\n</tr>";
            cont++;
        });
        contenido+="\n<script src=\"https://code.jquery.com/jquery-3.5.1.slim.min.js\" integrity=\"sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj\" crossorigin=\"anonymous\"></script>"+
        "\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx\" crossorigin=\"anonymous\"></script>";
        contenido+="\n</tbody>\n</table>\n</body>\n</html>";
        fs.writeFile('./errores.html', contenido, error => {
            if (error)
              console.log(error);
            else
              console.log('El archivo fue creado');
          });
        window.open('./errores.html');

    }
    Tree(contenido){
        fs.writeFile('./arbolsintactico.txt', contenido, error => {
            if (error)
              console.log(error);
            else
              console.log('El archivo fue creado');
          });
        var imagen=execSync('dot -Tsvg arbolsintactico.txt -o arbol.svg');
        window.open(imagen);
    }
}
const indexController=new IndexController();
module.exports=indexController;