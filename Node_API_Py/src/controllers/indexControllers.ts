import {Request, Response} from 'express';
import {scanner} from '../Analizadores/lexpython';
import Parser from '../Analizadores/sintacticopy';
import fs from 'fs';
class IndexController{
    public async index(req:Request,res:Response){
        res.json({title:"Bienvenido"});
    }
    public async Analisis(req:Request,res:Response){
        fs.readFile('/home/alex/Documentos/Cursos Universidad/Compi 1/Lab/Proyecto2/[OLC1]Proyecto2/OLC1_Proyect2_201700539/test/test.java','utf-8',(err,data)=>{
            if(err)throw console.log(err.message);
            scanner.ejecutar(data);
            var resultado=Parser.ejecutar(scanner);
            console.log(resultado.Traduccion);
            res.json({Errores_Lexicos:resultado.Errores,Tokens:scanner.tokens,Traduccion:resultado.Traduccion});
        });
    }
}
export const indexController=new IndexController();
