import { Router } from "express";
import { Register,Login, AuthenticatedUser, Logout,UpdateInfo,UpdatePassword } from "./controller/auth.controller";
import { Create,getProducts,showProduct } from "./controller/ProductController";
import { AuthMiddleware } from "./middleware/AuthMiddleware";
import { AdminAuthMiddleware } from "./middleware/AdminAuthMiddleware";
import { LoginAdmin } from "./controller/AdminController";
import { Users,CreateUser ,GetUser,UpdateUser,DeleteUser} from "./controller/user.controller";
import { Permission } from "./controller/permission.controller";
import { Roles,CreateRole,GetRole,UpdateRole,DeleteRole } from "./controller/role.controller";
import { getAbout, updateAbout } from "./controller/aboutController";

export const routes=(router:Router)=>{
  router.get('/', (req, res) => {
    res.render('index');
  });
  router.post('/login', LoginAdmin); // Use LoginAdmin for the /login route
  
  router.get('/dashboard', AdminAuthMiddleware,(req, res) => {
    res.render('dashboard');
  });

  router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
  });


  router.get('/about',AdminAuthMiddleware ,(req, res) => {
    res.render('about');
  });
router.get('/api/about',getAbout);
router.put('/api/about', AdminAuthMiddleware,updateAbout)
    
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


// permission
router.get('/api/permissions',AuthMiddleware,Permission);

// Role
 router.get('/api/roles',AuthMiddleware,Roles);
  router.post('/api/create/role',AuthMiddleware,CreateRole);
    router.get('/api/role/:id',GetRole);
   router.put('/api/role/:id',UpdateRole);
   router.delete('/api/role/:id',DeleteRole);


// product
router.post('/api/create',Create);
router.get('/api/products',getProducts);
router.get('/api/products/:id',showProduct);


}