import { Router } from "express";
import { Register,Login, AuthenticatedUser, Logout } from "./controller/auth.controller";
import { Create,showAllProducts } from "./controller/ProductController";
import { AuthMiddleware } from "./middleware/auth.middleware";

export const routes=(router:Router)=>{
 router.get('/', (req, res) => {
    res.send('Hello World!');
  });   
router.post('/api/register',Register);
router.post('/api/login',Login);
router.get('/api/user',AuthMiddleware,AuthenticatedUser);
router.post('/api/logout',AuthMiddleware,Logout);



// product
router.post('/api/create',Create);
 router.get('/api/products',showAllProducts);



}