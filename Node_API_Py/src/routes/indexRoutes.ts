import {Router} from 'express';
import {indexController} from '../controllers/indexControllers';
class IndexRoutes{
    public router:Router=Router();

    constructor(){
        this.config();
    }
    config():void {
        this.router.get('/',indexController.index)
        this.router.post('/Data/',indexController.Analisis);
        this.router.get('/Tokens',indexController.MostrarTokens);
        this.router.get('/ErroresPY',indexController.MostrarErrores);
    }
}
const indexRoutes=new IndexRoutes();
export default indexRoutes.router;