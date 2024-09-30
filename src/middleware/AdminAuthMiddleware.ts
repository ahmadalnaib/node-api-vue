import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Admin } from '../entity/admin.entity';
import { verify } from 'jsonwebtoken';

export const AdminAuthMiddleware = async (req: Request, res: Response,next:Function) => {

  try {
  const jwt=req.cookies['jwt'];
  const payload: any=verify(jwt,process.env.SECRET_KEY_ADMIN);

  if(!payload){
    return res.status(401).send('Unauthenticated');
  }



  const repository = getManager().getRepository(Admin);
  req['user'] = await repository.findOne({ where: { id: payload.id } });



  next();


  } catch (error) {
    return res.status(401).send('Unauthenticated');
  }


}