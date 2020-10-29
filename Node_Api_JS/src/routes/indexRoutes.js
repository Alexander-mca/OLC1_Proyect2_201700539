const {Router}=require('express');

const indexController=require('../controllers/indexController');
class IndexRoutes{
    constructor(){
        this.router=Router();
        this.config();
    }
    config(){
        this.router.get('/',indexController.Index);
        this.router.get('/Data',indexController.Analisis);
    }
}
const indexRoutes=new IndexRoutes();
module.exports=indexRoutes.router;