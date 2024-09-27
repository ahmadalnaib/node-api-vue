import { Router } from "express";
import { Register,Login, AuthenticatedUser, Logout,UpdateInfo,UpdatePassword } from "./controller/auth.controller";
import { Create,getProducts,showProduct } from "./controller/ProductController";
import { AuthMiddleware } from "./middleware/AuthMiddleware";
import { LoginAdmin } from "./controller/AdminController";
import { Users,CreateUser ,GetUser,UpdateUser,DeleteUser} from "./controller/user.controller";

export const routes=(router:Router)=>{
  router.get('/', (req, res) => {
    res.render('index');
  });
  router.get('/dashboard', (req, res) => {
    res.render('dashboard');
  });
  router.post('/login', LoginAdmin); // Use LoginAdmin for the /login route
    
router.post('/api/register',Register);
router.post('/api/login',Login);


router.get('/api/user',AuthMiddleware,AuthenticatedUser);
router.post('/api/logout',AuthMiddleware,Logout);
router.put('/api/user/info',AuthMiddleware,UpdateInfo);
router.put('/api/user/password',AuthMiddleware,UpdatePassword);

// users
router.get('/api/users',AuthMiddleware,Users);
router.post('/api/create/user',AuthMiddleware,CreateUser);
router.get('/api/user/:id',AuthMiddleware,GetUser);
router.put('/api/user/:id',AuthMiddleware,UpdateUser);
router.delete('/api/user/:id',AuthMiddleware,DeleteUser);



// product
router.post('/api/create',Create);
//  router.get('/api/products',showAllProducts);
 router.get('/api/products',getProducts);
  router.get('/api/products/:id',showProduct);


}