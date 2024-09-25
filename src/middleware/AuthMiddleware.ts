import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';
import { verify } from 'jsonwebtoken';

export const AuthMiddleware = async (req: Request, res: Response,next:Function) => {

  try {
  const jwt=req.cookies['jwt'];
  const payload: any=verify(jwt,process.env.SECRET_KEY);

  if(!payload){
    return res.status(401).send('Unauthenticated');
  }



  const repository = getManager().getRepository(User);
  req['user'] = await repository.findOne({ where: { id: payload.id } });



  next();


  } catch (error) {
    return res.status(401).send('Unauthenticated');
  }


}