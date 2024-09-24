import { Request, Response } from 'express';
import { RegosterValidation } from '../validation/register.validation';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';
import bcrypt from 'bcryptjs';
import {sign,verify } from 'jsonwebtoken';

export const Register=async (req:Request,res:Response)=>{
  const body=req.body;

  const {error}=RegosterValidation.validate(body);

  if(error){
    return res.status(400).send(error.details)
  }

  if(body.password !== body.confirm_password){
    return res.status(400).send('Password and confirm password do not match');
  }

  const respository=getManager().getRepository(User);

  const {password,confirm_password, ...user}= await respository.save({
    first_name:body.first_name,
    last_name:body.last_name,
    email:body.email,
    password:await bcrypt.hash(body.password,10),
    confirm_password:await bcrypt.hash(body.confirm_password,10)

  });

    res.send(user);
}


export const Login = async (req: Request, res: Response) => {
  const repository = getManager().getRepository(User);

  const email = req.body.email; // Extract email from req.body



  const user = await repository.findOne({ where: { email } });

  if (!user) {
    return res.status(400).send('Email or password is wrong');
  }

  if (!await bcrypt.compare(req.body.password, user.password)) {
    return res.status(400).send('Email or password is wrong');
  }



  const token=sign({id:user.id},process.env.SECRET_KEY);
  
  res.cookie('jwt',token,{httpOnly:true,maxAge:24*60*60*1000});


  res.send('Logged in');
};



export const AuthenticatedUser = async (req: Request, res: Response) => {


  const jwt=req.cookies['jwt'];
  const payload: any=verify(jwt,process.env.SECRET_KEY);

  if(!payload){
    return res.status(401).send('Unauthenticated');
  }



  const repository = getManager().getRepository(User);
  const user = await repository.findOne({ where: { id: payload.id } });


  res.send(user);


  return res.status(401).send('Unauthenticated');
}


export const Logout = async (req: Request, res: Response) => {
 res.cookie('jwt','',{maxAge:0});
  res.send('Logged out');

  
}