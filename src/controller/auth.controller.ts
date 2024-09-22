import { Request, Response } from 'express';
import { RegosterValidation } from '../validation/register.validation';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';
import bcyptis from 'bcryptjs';

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
    password:await bcyptis.hash(body.password,10),
    confirm_password:await bcyptis.hash(body.confirm_password,10)

  });

    res.send(user);
}