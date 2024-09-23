import { Router } from "express";
import { Register,Login } from "./controller/auth.controller";
import { Create,getProducts } from "./controller/ProductController";

export const routes=(router:Router)=>{
 router.get('/', (req, res) => {
    res.send('Hello World!');
  });   
router.post('/api/register',Register);
router.post('/api/login',Login);



// product
router.post('/api/create',Create);
//  router.get('/api/products',showAllProducts);
 router.get('/api/products',getProducts);


}