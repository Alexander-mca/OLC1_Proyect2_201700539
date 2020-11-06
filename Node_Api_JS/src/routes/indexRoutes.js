const {Router}=require('express');

const indexController=require('../controllers/indexController');
class IndexRoutes{
    constructor(){
        this.router=Router();
        this.config();
    }
    config(){
        this.router.get('/',indexController.Index);
        this.router.post('/Data/',indexController.Analisis);
        this.router.get('/arbol',indexController.MostrarArbol);
        this.router.get('/ErroresJS',indexController.MostrarErrores);
    }
}
const indexRoutes=new IndexRoutes();
module.exports=indexRoutes.router;