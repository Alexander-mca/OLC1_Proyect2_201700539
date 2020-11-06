import {Request, Response} from 'express';
import {scanner,Token} from '../Analizadores/lexpython';
import Parser from '../Analizadores/sintacticopy';
import fs from 'fs';
class IndexController{
    public async index(req:Request,res:Response){
        res.json({title:"Bienvenido"});
    }
    public async Analisis(req:Request,res:Response){
        // fs.readFile('/home/alex/Documentos/Cursos Universidad/Compi 1/Lab/Proyecto2/[OLC1]Proyecto2/OLC1_Proyect2_201700539/test/test.java','utf-8',(err,data)=>{
        //     if(err)throw console.log(err.message);
        //     scanner.ejecutar(data);
        //     var resultado=Parser.ejecutar(scanner);
        //     console.log(resultado.Traduccion);
        //     res.json({Errores_Lexicos:resultado.Errores,Tokens:scanner.tokens,Traduccion:resultado.Traduccion});
        // });
        var documento=req.body.Value.toString();
        console.log("*****************************************\n"+documento);
        console.log("si entra a Analisis en py");
        scanner.ejecutar(documento);
        var resultado=Parser.ejecutar(scanner);
        //this.ReporteTokens(scanner.tokens);
        console.log(resultado.Traduccion);
        res.send(resultado.Traduccion);
    }
    ReporteTokens(tokens:Token[]){
        var cont=0;
        var contenido="<html>\n<head>\n<title>Errores</title>\n</head>"+
        "\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css\" integrity=\"sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2\" crossorigin=\"anonymous\">\n<body>";
        contenido+="\n<table class=\"table table-hover\">\n<thead>\n";
        contenido+="<tr>\n<th scope=\"col\">No.</th>"+
        "\n<th scope=\"col\">Tipo</th>\n<th scope=\"col\">Lexema</th>"+
        "\n<th scope=\"col\">Linea</th>\n<th scope=\"col\">Columna</th>\n</tr>\n</thead>";
        contenido+="\n<tbody>";
        tokens.forEach(tk => {
            contenido+="\n<tr class=\"table-info\">\n<td scope=\"row\">"+String(cont)+"</td>"+
            "\n<td>"+String(tk.tipo)+"</td>"+"\n<td>"+tk.lexema+"</td>"
            "\n<td>"+String(tk.fila)+"</td>"+"\n<td>"+String(tk.columna)+"</td>\n</tr>";
            cont++;
        });
        contenido+="\n<script src=\"https://code.jquery.com/jquery-3.5.1.slim.min.js\" integrity=\"sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj\" crossorigin=\"anonymous\"></script>"+
        "\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx\" crossorigin=\"anonymous\"></script>";
        contenido+="\n</tbody>\n</table>\n</body>\n</html>";
        fs.writeFile('./tokens.html', contenido, error => {
            if (error)
              console.log(error);
            else
              console.log('El archivo fue creado');
          });
        window.open('./tokens.html');
    }
}
export const indexController=new IndexController();
