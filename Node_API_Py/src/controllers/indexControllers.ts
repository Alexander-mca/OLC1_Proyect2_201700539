import {Request, Response} from 'express';
import {scanner,Token} from '../Analizadores/lexpython';
import Parser from '../Analizadores/sintacticopy';
import funciones from '../Analizadores/funciones';
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
        funciones.ReporteTokens(scanner.tokens);
        funciones.ReporteErrores(resultado.Errores);
        var aux=resultado.Traduccion;
        var errores=funciones.getErrores(resultado.Errores);
        resultado.Traduccion=errores+aux;
        res.send(resultado.Traduccion);
    }
    public async MostrarTokens(req:Request,res:Response){
        if(fs.existsSync('tokens.html')){
        var tk=fs.readFileSync('tokens.html', 'utf-8');
        res.send(tk);
        }
    }
    public async MostrarErrores(req:Request,res:Response){
        if(fs.existsSync('errores.html')){
        var err=fs.readFileSync('errores.html', 'utf-8');
        res.send(err);
        }else{
            res.json({Info:"No hubieron errores"});
        }
    }
    
}
export const indexController=new IndexController();
