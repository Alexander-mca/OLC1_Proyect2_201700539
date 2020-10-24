import {Request, Response} from 'express';
import {Scanner} from '../Analizadores/lexpython';
import {Parser} from '../Analizadores/sintacticopy';
class IndexController{
    public index(req:Request,res:Response){
        res.json({title:"Bienvenido"});
    }
    public Analisis(req:Request,res:Response){
        var documento=req.body.Value.toString();
        //traduccion a python
        var scan:Scanner=new Scanner();
        scan.ejecutar(documento);
        var parse_:Parser=new Parser();
        parse_.ejecutar(scan);
        var resultadoPy={
            Tokens:parse_.tokens,
            Errores:parse_.errores,
            Traduccion:parse_.traduccion
        }
        var respy=JSON.stringify(resultadoPy);
        res.json( {"Python":[respy]})
        console.log("Esta en indexController");
    }
}
export const indexController=new IndexController();
