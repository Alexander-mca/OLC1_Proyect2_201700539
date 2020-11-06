const express=require('express');
const morgan=require('morgan');
const cors=require('cors');
const app=express();
const bodyParser=require('body-parser');
//imports
// const Parser=require('./Analizador/gramatica2');
// const Trad=require('./Analizador/traduccion');
// const Arbol = require('./Analizador/GenerateTree');
// const indexController = require('./controllers/indexController');
const indexRoutes = require('./routes/indexRoutes');


//settings
const ip=process.env.NODEIPJS || "127.18.7.5";
const  port=process.env.NODEPORTJS || 3080;

//middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use('/',indexRoutes);
// app.post('/Data/',function(req,res){
//     console.log(req.body.toString());
//     console.log("Aqui nos quedamos");
//     var resultado=Parser.parse(req.body.toString());
//     var traducion=Trad.parse(req.body.toString());
//     var arbol=new Arbol(resultado.AST);
//     var ast=arbol.getContenido();
//     indexController.Tree(ast);
//     indexController.ReporteErrores(resultado.Errores);
//     console.log(traducion);
//     res.send(traducion);
// });


//run
app.listen(port, async() => {
    //console.log('IP: %s PORT: %d', ip, port);
    console.log('Server on Port %d',port);
})